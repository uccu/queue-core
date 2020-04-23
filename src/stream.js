
import isJSONString from 'isjsonstring'
import Connect from './connect'


const STATUS_INIT = 0
const STATUS_CONNECTED = 0
const STATUS_CONNECTING = 0


class Stream {


    constructor(buffer, socket) {

        this.buffer = buffer
        this.status = STATUS_INIT


        const fin = this.getPiece(1, 3) // opcode
        const ssl = this.getPiece(1, 1, 3) // is ssl
        const fd = this.getPiece(1, 1, 4) // need feedback
        const ol = this.getPiece(1, 1, 5) // has only id

        if (fin === 0) {
            // rejected
            console.log(chalk.yellow('client rejected connection'));
            socket.end(); return;
        } else if (fin === 1) {
            // connecting
            return new Connect(this.buffer.slice(2), socket);
        } else if (fin === 2) {
            // send text
            return new Text(this.buffer.slice(2), socket);
        } else if (fin === 3) {
            // send binary
            return new Binary(this.buffer.slice(2), socket);
        } else if (fin === 4) {
            // ping
        } else if (fin === 5) {
            // pong
        } else if (fin === 6) {
            // check
        } else {
            console.log(chalk.yellow('undefined opcode'));
            socket.end(); return;
        }

        data = data.toString()
        if (!isJSONString(data)) return

        data.type

        console.log(chalk.green('recieve data') + ':', data.toString());
    }


    getPiece(loc, length = 8, start = 0) {
        return (this.buffer[loc] & (2 ** (8 - start) - 1)) >> (8 - length - start);
    }


}



export default Stream