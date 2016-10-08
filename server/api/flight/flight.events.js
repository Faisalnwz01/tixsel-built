/**
 * Flight model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _flight = require('./flight.model');

var _flight2 = _interopRequireDefault(_flight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FlightEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
FlightEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _flight2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    FlightEvents.emit(event + ':' + doc._id, doc);
    FlightEvents.emit(event, doc);
  };
}

exports.default = FlightEvents;
//# sourceMappingURL=flight.events.js.map
