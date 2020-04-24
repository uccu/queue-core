const net = require('net')
const chalk = require('chalk')
const { EventEmitter } = require('events');


class client extends EventEmitter {

    constructor() {
        super();
        const socket = new net.Socket();
        Object.defineProperty(this, '_client', {
            value: socket
        });
    }


    start(port = 8879, host = '127.0.0.1') {
        this._client.connect(port, host, () => {
            console.log(chalk.cyan('server connected'));
        });
        return this;
    }

}

module.exports = client