Koa-JRPC2
=====

Koa middleware for JRPC2

INSTALL
======
```
npm install koa-jrpc2
```


USING
=====

Using with Koa as middleware:

```javascript

var rpc = require('jrpc2');
var koaMiddleware = require('koa-jrpc2');
var _ = require('koa-route');
var app = require('koa')();
var rpcServer = new rpc.server();

rpcServer.loadModules(__dirname + '/modules/', function () {
    app.use(_.post('/api', koaMiddleware(rpcServer)));
    app.listen(80);
});

```