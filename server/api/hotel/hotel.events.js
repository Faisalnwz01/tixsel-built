/**
 * Hotel model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _hotel = require('./hotel.model');

var _hotel2 = _interopRequireDefault(_hotel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HotelEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
HotelEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _hotel2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    HotelEvents.emit(event + ':' + doc._id, doc);
    HotelEvents.emit(event, doc);
  };
}

exports.default = HotelEvents;
//# sourceMappingURL=hotel.events.js.map
