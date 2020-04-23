import net from 'net'
import chalk from 'chalk'

const client = net.createConnection({ port: 12200 }, () => {
    console.log('connected');
    client.write('test msg');

    setTimeout(() => {
        client.end();
    }, 5000)

});

client.on('data', (data) => {
    console.log(chalk.green('recieve data') + ':', data.toString());
});
client.on('end', () => {
    console.log('closed');
});