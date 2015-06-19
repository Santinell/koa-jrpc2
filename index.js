var parser = require('co-body');

module.exports = exports = function (server) {
  return function *(next) {
    if (this.request.method === 'POST') {
      var body = yield parser.json(this);
      var me = this;
      var req = this.req;
      req.client_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1'      
      req.client_ip = req.client_ip.replace('::ffff:', '')
      server.handleCall(body, req, function (answer) {
          me.body = answer;
      });
    } else {
      yield next;
    }
  };
}
