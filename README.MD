### 目的
---
给多线程/多服务器进行排队。

#### 安装/下载
```javascript
npm install queue-core
```

#### 开启服务器
```javascript
const QueueServer = require('queue-core').server;
const server = new QueueServer;
server.start(); // 默认端口8879
// server.start([port]);
```

#### 连接服务器
```javascript
const QueueClient = require('queue-core').client;
const client = new QueueClient;
client.start(); // 默认端口8879
// client.start([port[, host]]);
```

#### 排队处理
```javascript
client.on('connect', ()=> {
	console.log('change start');
	process.nextTick(async function () {
		await client.wait('changeName');
        // code for changing name, waiting about 300ms
        client.unlock('changeName');
		console.log('change finished');
    });
	process.nextTick(async function () {
		await client.wait('changeName');
        // code for changing name, waiting about 500ms
        client.unlock('changeName');
		console.log('change finished');
    });
}

# change start
// (wait about 300ms)
# change finished
// (wait about 500ms)
# change finished
```

### Document
---
#### Class: [QueueClient](#)

##### [new QueueClient()](#)
Creates a new client object.

##### Event: [connect](#)
Emitted when a socket connection is successfully established.

##### Event: [error](#)
- [Error](#)
- [Request](#)
- [Response](#)

Emitted when an error occurs.

##### [client.start([port[, host]])](#)
- port [&lt;Number&gt;](#)
- host [&lt;String&gt;](#)

Initiate a connection on a given client.

##### [client.lock(name)](#)
- name [&lt;String&gt;](#) lock name
- return [&lt;Boolean&gt;](#) success or fail

lock

##### [client.unlock(name)](#)
- name [&lt;String&gt;](#) lock name
- return [&lt;Boolean&gt;](#) success or fail，almostly success

unlock

##### [client.wait(name)](#)
- name [&lt;String&gt;](#) lock name
- return [&lt;Boolean&gt;](#) success or fail

加入队列，直到请求前所有同名请求unlock之后返回，超时则返回false

