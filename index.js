var parser = require('co-body');

module.exports = exports = function (server) {
  return function *(next) {
    if (this.request.method === 'POST') {
      var body = yield parser.json(this);
      var me = this;
      var req = this.req;
      if (req.cookies)
        req.headers.cookies = req.cookies;
      req.headers.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      server.handleRequest(body, req.headers, function (answer) {
          me.body = answer;
      });
    } else {
      yield next;
    }
  };
}
