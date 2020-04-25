const client = new (require('.').client);


client.start()


client.on('connect', async function () {

    const time = Date.now();
    console.log(time)


    process.nextTick(async function () {

        await new Promise(r => setTimeout(r, 2000));
        const data1 = await client.wait('changeName');
        console.log(Date.now(), data1, 1);
        await new Promise(r => setTimeout(r, 1000));
        await client.unlock('changeName');
        
    });

    process.nextTick(async function () {
        await new Promise(r => setTimeout(r, 1000));
        const data2 = await client.wait('changeName');
        console.log(Date.now(), data2, 2);
        await new Promise(r => setTimeout(r, 500));
        await client.unlock('changeName');
        
    });

    process.nextTick(async function () {

        await new Promise(r => setTimeout(r, 500));
        const data3 = await client.wait('changeName');
        console.log(Date.now(), data3, 3);
        await new Promise(r => setTimeout(r, 2000));
        await client.unlock('changeName');
        
    });




});


