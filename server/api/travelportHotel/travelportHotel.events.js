/**
 * TravelportHotel model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _travelportHotel = require('./travelportHotel.model');

var _travelportHotel2 = _interopRequireDefault(_travelportHotel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TravelportHotelEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
TravelportHotelEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _travelportHotel2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    TravelportHotelEvents.emit(event + ':' + doc._id, doc);
    TravelportHotelEvents.emit(event, doc);
  };
}

exports.default = TravelportHotelEvents;
//# sourceMappingURL=travelportHotel.events.js.map
