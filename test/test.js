var should = require("chai").should();
var rpc = require("jrpc2");
var app = require("koa")();
var koaMiddleware = require("../");
var server = null;

describe("Server", function () {

  it("should have context", function () {
    server = new rpc.Server();
    server.should.have.property("context");
  });

  it("should correctly load modules from directory", function () {
    server.loadModules(__dirname + "/modules/", function () {
      server.methods.should.have.property("users.auth");
      server.methods.should.have.property("logs.userLogout");
      server.methods["users.auth"].should.be.an["instanceof"](Function);
    });
  });

  it("should have success function exposed", function () {
    server.expose("sum", function (a, b) {
      return a + b;
    });
    server.should.have.property("modules");
    server.modules.methods.should.have.property("sum");
    server.modules.methods["sum"].should.be.an["instanceof"](Function);
  });
});


describe("koaMiddleware", function () {

  it("should success listen server", function () {
    (function () {
      app.use(koaMiddleware(server));
      app.listen(8081);
    }).should.not.throw(Error);
  });


  it("should work with httpClient", function (done) {
    var httpTransport = new rpc.httpTransport({port: 8081});
    httpClient = new rpc.Client(httpTransport);
    var callback = function (err, raw) {
      should.not.exist(err);
      var obj = JSON.parse(raw);
      obj.should.deep.equal({id: 1, jsonrpc: '2.0', result: 16});
      done();
    };
    httpClient.invoke("sum", [4, 12], callback);
  });

  it("should work with async server methods", function (done) {

    server.expose("sumAsync", function (a, b) {
    	var promise = new Promise(function(resolve) {
    		setTimeout(resolve.bind(null, a+b), 500);
    	});
    	
    	return promise;
    });

    var httpTransport = new rpc.httpTransport({port: 8081});
    httpClient = new rpc.Client(httpTransport);
    var callback = function (err, raw) {
      should.not.exist(err);
      var obj = JSON.parse(raw);
      obj.should.deep.equal({id: 1, jsonrpc: '2.0', result: 16});
      done();
    };
    httpClient.invoke("sumAsync", [4, 12], callback);
  });

});
