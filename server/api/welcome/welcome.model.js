'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WelcomeSchema = new _mongoose2.default.Schema({
  name: String,
  info: String,
  active: Boolean,
  email: String,
  message: String,
  phone: String
});

exports.default = _mongoose2.default.model('Welcome', WelcomeSchema);
//# sourceMappingURL=welcome.model.js.map
