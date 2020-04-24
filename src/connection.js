
const { EventEmitter } = require('events');
const Stream = require('./stream')

const def = require('./helper/def')

const { ms } = require('./memory')


class Connection extends EventEmitter {

    constructor(socket) {
        super();
        def(this, { socket });
        console.log('one connection connected')
        this.STATUS = Connection.STATUS_INITED;
        socket.on('data', buffer => {
            const stream = new Stream(buffer, this);

            if (stream.type === Stream.TYPE_ERROR) {
                socket.end();
                this.emit('error', stream.error);
            } else if (stream.type === Stream.TYPE_REGISTER) {
                if (this.STATUS >= Connection.STATUS_REGISTERED) {
                    socket.write(new Buffer.from([0]));
                } else {
                    this.STATUS = Connection.STATUS_REGISTERED;
                    socket.write(new Buffer.from([7]));
                    this.emit('register', stream);
                }

            } else if (stream.type === Stream.TYPE_LOCK) {
                const status = ms.lock(stream.lockName);
                if (status) {
                    socket.write(new Buffer.from([7]));
                } else {
                    socket.write(new Buffer.from([0]));
                }
                this.emit('lock', stream);
            } else if (stream.type === Stream.TYPE_UNLOCK) {
                const status = ms.unlock(stream.lockName);
                if (status) {
                    socket.write(new Buffer.from([7]));
                } else {
                    socket.write(new Buffer.from([0]));
                }
                this.emit('unlock', stream);
            } else if (stream.type === Stream.TYPE_WAIT) {
                this.emit('beforeWait', stream);
                ms.wait(stream.lockName).then(status => {
                    if (status) {
                        socket.write(new Buffer.from([7]));
                    } else {
                        socket.write(new Buffer.from([0]));
                    }
                    this.emit('wait', stream);
                });
            } else if (stream.type === Stream.TYPE_PING) {
                socket.write(new Buffer.from([6]));
            }
        });
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