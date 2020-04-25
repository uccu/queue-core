
class Request {

    constructor(buffer) {
        this.buffer = buffer;

        let pi = 1;
        this.opcode = this.getPiece(0, 4);

        if (this.opcode > 7) {
            this.opcode = Request.OPCODE.ERROR;
            this.error = new Error('invalid opcode');
            return;
        }

        if (this.getPiece(0, 2, 6) !== 0) {
            this.opcode = Request.OPCODE.ERROR;
            this.error = new Error('invalid reserv');
            return;
        }

        if (this.getPiece(0, 1, 4)) {
            pi++;
            this.idLength = this.getPiece(pi - 1);
            this.id = this.buffer.slice(pi, pi + this.idLength).toString();
            pi += this.idLength;
        }

        if (this.getPiece(0, 1, 5)) {
            pi++;
            this.dataLength = this.getPiece(pi - 1);
            this.data = this.buffer.slice(pi, pi + this.dataLength).toString();
            pi += this.dataLength;
        }

        const fin = this.buffer.slice(pi);
        if (fin.length !== 3 || fin[0] !== 0 || fin[1] !== 255 || fin[2] !== 0) {
            this.opcode = Request.OPCODE.ERROR;
            this.error = new Error('invalid fin');
            return;
        }

    }

    getPiece(loc, length = 8, start = 0) {
        return (this.buffer[loc] & (2 ** (8 - start) - 1)) >> (8 - length - start);
    }


}

Request.OPCODE = {};
Request.OPCODE.REJECT = 0;
Request.OPCODE.REGISTER = 1;
Request.OPCODE.LOCK = 2;
Request.OPCODE.UNLOCK = 3;
Request.OPCODE.WAIT = 4;
Request.OPCODE.PING = 5;
Request.OPCODE.PONG = 6;
Request.OPCODE.REPLY = 7;
Request.OPCODE.ERROR = -1;

module.exports = Request;