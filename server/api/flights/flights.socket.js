/**
 * Broadcast updates to client when the model changes
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _flights = require('./flights.events');

var _flights2 = _interopRequireDefault(_flights);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Model events to emit
var events = ['save', 'remove'];

function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('flights:' + event, socket);

    _flights2.default.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}

function createListener(event, socket) {
  return function (doc) {
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function () {
    _flights2.default.removeListener(event, listener);
  };
}
//# sourceMappingURL=flights.socket.js.map
