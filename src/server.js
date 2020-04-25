
const net = require('net')
const chalk = require('chalk')
const { EventEmitter } = require('events');


const Connection = require('./connection')




class server extends EventEmitter {

    constructor() {

        super();
        const server = new net.Server();
        Object.defineProperty(this, '_server', {
            value: server
        });
    }

    start(port = 8879) {
        this._server.listen(port, () => {
            console.log(chalk.cyan('server opened'));
            this.emit('listen');
        });

        this._server.on('close', () => {
            console.log(chalk.red('server closed'));
            this.emit('close');
        });
        this._server.on('error', () => {
            console.log(chalk.red('server errored'));
            this.emit('error');
        });
        this._server.on('connection', socket => {
            const connection = new Connection(socket);
            this.emit('connection', connection);
            connection.on('end', () => console.log('closed'));
            connection.on('error', e => console.error(e));
        });
        return this;
    }
}


module.exports = server