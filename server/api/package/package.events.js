/**
 * Package model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _package = require('./package.model');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PackageEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
PackageEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _package2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    PackageEvents.emit(event + ':' + doc._id, doc);
    PackageEvents.emit(event, doc);
  };
}

exports.default = PackageEvents;
//# sourceMappingURL=package.events.js.map
