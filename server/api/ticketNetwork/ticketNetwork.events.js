/**
 * TicketNetwork model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _ticketNetwork = require('./ticketNetwork.model');

var _ticketNetwork2 = _interopRequireDefault(_ticketNetwork);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TicketNetworkEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
TicketNetworkEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _ticketNetwork2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    TicketNetworkEvents.emit(event + ':' + doc._id, doc);
    TicketNetworkEvents.emit(event, doc);
  };
}

exports.default = TicketNetworkEvents;
//# sourceMappingURL=ticketNetwork.events.js.map
