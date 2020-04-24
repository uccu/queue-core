"use strict";

const def = require('./helper/def');


class Stream {

    constructor(buffer, connection) {

        def(this, {
            buffer, connection
        })

        const fin = this.getPiece(1) // opcode

        this.type = fin;

        if (fin === 0) {
            // reject
        } else if (fin === 1) {
            // register
        } else if (fin === 2) {
            // lock
            this.lockKey = buffer.slice(1).toString();
        } else if (fin === 3) {
            // unlock
            this.lockKey = buffer.slice(1).toString();
        } else if (fin === 4) {
            // wait
            this.lockKey = buffer.slice(1).toString();
        } else if (fin === 5) {
            // ping
        } else if (fin === 6) {
            // pong
        } else if (fin === 7) {
            // reply
        }

    }


    getPiece(loc, length = 8, start = 0) {
        return (this.buffer[loc] & (2 ** (8 - start) - 1)) >> (8 - length - start);
    }


}

def(Stream, {
    TYPE_REJECT: 0,
    TYPE_REGISTER: 1,
    TYPE_LOCK: 2,
    TYPE_UNLOCK: 3,
    TYPE_WAIT: 4,
    TYPE_PING: 5,
    TYPE_PONG: 6,
    TYPE_REPLY: 7,
    TYPE_REBOT: 7,
    TYPE_ERROR: -1
});



module.exports = Stream;