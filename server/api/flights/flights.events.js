/**
 * Flights model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _flights = require('./flights.model');

var _flights2 = _interopRequireDefault(_flights);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FlightsEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
FlightsEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _flights2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    FlightsEvents.emit(event + ':' + doc._id, doc);
    FlightsEvents.emit(event, doc);
  };
}

exports.default = FlightsEvents;
//# sourceMappingURL=flights.events.js.map
