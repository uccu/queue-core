
const { EventEmitter } = require('events');

const def = require('./helper/def');

const { ms } = require('./memory');
const Request = require('./request');
const Response = require('./response');

class Connection extends EventEmitter {

    constructor(socket) {
        super();
        def(this, { socket });
        console.log('one connection connected')
        this.STATUS = Connection.STATUS_INITED;
        socket.on('data', buffer => {
            const req = new Request(buffer);
            const res = new Response(socket);

            if (req.opcode === Request.OPCODE.ERROR) {
                res.end();
                this.emit('error', req.error, req, res);
            } else if (req.opcode === Request.OPCODE.REGISTER) {
                if (this.STATUS >= Connection.STATUS_REGISTERED) {
                    res.send(Response.OPCODE.REJECT, req.id);
                } else {
                    this.STATUS = Connection.STATUS_REGISTERED;
                    res.send(Response.OPCODE.REPLY, req.id);
                    this.emit('register', req, res);
                }

            } else if (req.opcode === Request.OPCODE.LOCK) {
                const status = ms.lock(req.data);
                if (status) {
                    res.send(Response.OPCODE.REPLY, req.id);
                } else {
                    res.send(Response.OPCODE.REJECT, req.id);
                }
                this.emit('lock', req, res);
            } else if (req.opcode === Request.OPCODE.UNLOCK) {
                const status = ms.unlock(req.data);
                if (status) {
                    res.send(Response.OPCODE.REPLY, req.id);
                } else {
                    res.send(Response.OPCODE.REJECT, req.id);
                }
                this.emit('unlock', req, res);
            } else if (req.opcode === Request.OPCODE.WAIT) {
                this.emit('beforeWait', req);
                ms.wait(req.data).then(status => {
                    if (status) {
                        res.send(Response.OPCODE.REPLY, req.id);
                    } else {
                        res.send(Response.OPCODE.REJECT, req.id);
                    }
                    this.emit('wait', req, res);
                });
            } else if (req.opcode === Request.OPCODE.PING) {
                res.send(Response.OPCODE.PONG, req.id);
            }
        });
        socket.on('error', e => {
            console.error(e);
        })
        socket.on('end', () => {
            this.STATUS = Connection.STATUS_CLOSED;
            this.emit('end');
        });
    }


}

Connection.STATUS_INITED = 0;
Connection.STATUS_REGISTERED = 1;
Connection.STATUS_CLOSED = 2;

module.exports = Connection;