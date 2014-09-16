var should = require("chai").should();
var rpc = require("jrpc2");
var app = require("koa")();
var koaMiddleware = require("../");
var server = null;

describe("Server", function () {

  it("should have context", function () {
    server = new rpc.server();
    server.should.have.property("context");
  });

  it("should correct load modules from directory", function () {
    server.loadModules(__dirname + "/modules/", function () {
      server.methods.should.have.property("users.auth");
      server.methods.should.have.property("logs.userLogout");
      server.methods["users.auth"].should.be.an["instanceof"](Function);
    });
  });

  it("should have success function expose", function () {
    server.expose("sum", function (a, b) {
      return a + b;
    });
    server.should.have.property("methods");
    server.methods.should.have.property("sum");
    server.methods["sum"].should.be.an["instanceof"](Function);
  });

});


describe("koaMiddleware", function () {

  it("should success listen server", function () {
    (function () {
      app.use(koaMiddleware(server));
      app.listen(8080);
    }).should.not.throw(Error);
  });


  it("should correct works with httpClient", function (done) {
    var httpTransport = new rpc.httpTransport({port: 8080});
    httpClient = new rpc.client(httpTransport);
    var callback = function (err, raw) {
      should.not.exist(err);
      var obj = JSON.parse(raw);
      obj.should.deep.equal({id: 1, jsonrpc: '2.0', result: 16});
      done();
    };
    httpClient.call("sum", [4, 12], callback);
  });
});