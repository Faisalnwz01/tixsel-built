/**
 * Welcome model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _welcome = require('./welcome.model');

var _welcome2 = _interopRequireDefault(_welcome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WelcomeEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
WelcomeEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _welcome2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    WelcomeEvents.emit(event + ':' + doc._id, doc);
    WelcomeEvents.emit(event, doc);
  };
}

exports.default = WelcomeEvents;
//# sourceMappingURL=welcome.events.js.map
