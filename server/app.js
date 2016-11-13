/**
 * Main application file
 */

'use strict';

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _environment = require('./config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _uAPI = require('./config/uAPI');

var _uAPI2 = _interopRequireDefault(_uAPI);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _uapiJson = require('uapi-json');

var _uapiJson2 = _interopRequireDefault(_uapiJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = require('bluebird');


// Connect to MongoDB
_mongoose2.default.connect(_environment2.default.mongo.uri, _environment2.default.mongo.options);
_mongoose2.default.connection.on('error', function (err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if (_environment2.default.seedDB) {
  require('./config/seed');
}

// Setup server
var app = (0, _express2.default)();
var server = _http2.default.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: _environment2.default.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);
require('events').EventEmitter.prototype._maxListeners = 100;
// Start server
function startServer() {
  app.angularFullstack = server.listen(_environment2.default.port, _environment2.default.ip, function () {
    console.log('Express server listening on %d, in %s mode', _environment2.default.port, app.get('env'));
  });
}
var settings = {
  auth: {
    username: _uAPI2.default.username,
    password: _uAPI2.default.password
  }
};
var AirService = _uapiJson2.default.createAirService(settings);

AirService.importPNR().catch(function (err) {
  if (err instanceof _uapiJson2.default.errors.Common.ValidationError) {
    console.log('Validation error occured');
  }
  if (err instanceof _uapiJson2.default.errors.Request.RequestValidationError) {
    console.log('Validation error occured in request');
  }
  if (err instanceof _uapiJson2.default.errors.Request.RequestValidationError.ParamsMissing) {
    console.log('Params are missing for request');
  }
});

(0, _setImmediate3.default)(startServer);

// Expose app
exports = module.exports = app;
//# sourceMappingURL=app.js.map
