import net from 'net'
import chalk from 'chalk'


import Stream from './stream'


const server = new net.Server()

server.listen(12200)


server.on('close', e => {
    console.log(chalk.red('server closed'))
})


server.on('connection', socket => {
    socket.write('connect success');
    socket.on('data', buffer => new Stream(buffer, socket));
    socket.on('end', () => {
        console.log('closed');
    });
})



console.log(chalk.cyan('server opened'))