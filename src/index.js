// import { argv } from 'yargs'
// console.log(argv);
// console.log(process.argv);

// console.log(1)





process.nextTick(() => {

    setTimeout(() => {
        console.log(1)
    }, 1000)
});


setInterval(()=>{
    console.log(2)
},500)