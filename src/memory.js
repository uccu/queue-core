
const promise = require('bluebird');

class Lock {
    constructor(name, expire) {
        this.expire = expire || 5000;
        this.name = name;
        this.locked = 0;
        this.list = [];
        this._;
    }

    lock() {
        if (this.locked) return false;
        this.locked = 1;

        this._ = setTimeout(() => {
            const nextConnection = this.list.shift();
            if (nextConnection) {
                clearTimeout(this._);
                nextConnection(true);
            } else {
                this.locked = 0;
            }

        }, this.expire);

        return true;
    }


    unlock() {
        const nextConnection = this.list.shift();
        if (nextConnection) {
            clearTimeout(this._);
            nextConnection(true);
            return true;
        }

        this.locked = 0;
        return true;
    }


    wait() {
        const result = this.lock();
        if (!result) {
            return new promise(r => this.list.push(r));
        }

        return promise.resolve(true);
    }
}

class Memory {

    constructor() {
        this.locks = new Map
    }

    getLock(name) {
        if (!this.locks.has(name)) this.locks.set(name, new Lock(name));
        return this.locks.get(name);
    }


    lock(name) {
        return this.getLock(name).lock();
    }

    unlock(name) {
        return this.getLock(name).unlock();
    }

    wait(name) {
        return this.getLock(name).wait()
    }

}

Memory.ms = new Memory;
module.exports = Memory;

