const net = require('net')
const promise = require('bluebird')
const chalk = require('chalk')
const { EventEmitter } = require('events');

const Response = require('./response');
const Request = require('./request');
const md5 = require('./helper/md5');

const ms = new class {

    constructor() {
        this.list = new Map;
    }

    wait(id, fn) {
        return new promise(r => {
            const t = setTimeout(() => {
                if (this.list.has(id)) {
                    this.list.get(id).r(false);
                    this.list.delete(id)
                }
            }, 5000);
            this.list.set(id, { r, t });
            fn(id, r);
        })
    }

    emit(id, result) {
        if (this.list.has(id)) {
            this.list.get(id).r(result);
            clearTimeout(this.list.get(id).t);
            this.list.delete(id);
        }
    }


};


class client extends EventEmitter {

    constructor() {
        super();
        const socket = new net.Socket();
        Object.defineProperty(this, '_client', {
            value: socket
        });
    }


    start(port = 8879, host = '127.0.0.1') {

        this._client.connect(port, host, async () => {
            const res = new Response(this._client);
            const id = md5(Math.random() + '').slice(8);
            const result = await ms.wait(id, () => {
                return res.send(1, id);
            });
            if (!result) {
                console.error(chalk.cyan('register fail'));
                res.end();
                return;
            }
            console.log(chalk.cyan('queue register success'), chalk.cyan('connected ' + host + ':' + port));
            this.emit('connect');
        });

        this._client.on('data', buffer => {
            const req = new Request(buffer);
            const res = new Response(this._client);

            if (req.opcode === Request.OPCODE.ERROR) {
                res.end();
                this.emit('error', req.error, req, res);
            } else if (req.opcode === Request.OPCODE.REJECT) {
                ms.emit(req.id, false);
            } else if (req.opcode === Request.OPCODE.REPLY) {
                ms.emit(req.id, true);
            }

        });

        this._client.on
        return this;
    }

    lock(name) {
        const res = new Response(this._client);
        const id = md5(Math.random() + '').slice(8);
        return ms.wait(id, () => {
            return res.send(2, id, name);
        });
    }

    unlock(name) {
        const res = new Response(this._client);
        const id = md5(Math.random() + '').slice(8);
        return ms.wait(id, () => {
            return res.send(3, id, name);
        });
    }

    wait(name) {
        const res = new Response(this._client);
        const id = md5(Math.random() + '').slice(8);
        return ms.wait(id, () => {
            return res.send(4, id, name);
        });
    }

}

module.exports = client