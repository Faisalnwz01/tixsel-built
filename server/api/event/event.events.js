/**
 * Event model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _event = require('./event.model');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
EventEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _event2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    EventEvents.emit(event + ':' + doc._id, doc);
    EventEvents.emit(event, doc);
  };
}

exports.default = EventEvents;
//# sourceMappingURL=event.events.js.map
