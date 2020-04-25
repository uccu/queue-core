"use strict";

const _ = require('lodash')


class Response {

    constructor(socket) {
        this.socket = socket;
    }

    setOpcode(opcode) {
        this.opcode = opcode;
    }

    setId(id) {
        this.id = Buffer.from(id);
        this.idLength = this.id.length;
    }

    setData(data) {
        this.data = Buffer.from(data);
        this.dataLength = this.data.length;
    }


    send(opcode, id, data) {

        if (opcode !== undefined) {
            this.setOpcode(opcode);
        }
        if (id) {
            this.setId(id);
        }
        if (data) {
            this.setData(data);
        }

        if (this.opcode === undefined) {
            return false;
        }

        let buffer = Buffer.concat([
            Buffer.from([(this.opcode << 4) + (this.idLength ? 0b1000 : 0) + (this.dataLength ? 0b100 : 0)])
        ]);

        if (this.idLength) {
            buffer = Buffer.concat([
                buffer, Buffer.from([this.idLength]), this.id
            ]);
        }

        if (this.dataLength) {
            buffer = Buffer.concat([
                buffer, Buffer.from([this.dataLength]), this.data
            ]);
        }

        buffer = Buffer.concat([
            buffer, Buffer.from([0, 255, 0])
        ]);

        return this.socket.write(buffer);
    }


    end() {
        return this.socket.end();
    }

}


Response.OPCODE = {};
Response.OPCODE.REJECT = 0;
Response.OPCODE.REGISTER = 1;
Response.OPCODE.LOCK = 2;
Response.OPCODE.UNLOCK = 3;
Response.OPCODE.WAIT = 4;
Response.OPCODE.PING = 5;
Response.OPCODE.PONG = 6;
Response.OPCODE.REPLY = 7;


module.exports = Response;