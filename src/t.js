

const buf = Buffer.from([0b11110000]);

const n = (buf[0] & 0b00111111) >> 3 ;
console.log(n.toString(2));