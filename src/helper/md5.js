const crypto = require('crypto');
module.exports = (c) => {
    return crypto.createHash('md5').update(c).digest("hex")
}