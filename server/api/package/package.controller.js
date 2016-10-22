/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/packages              ->  index
 * POST    /api/packages              ->  create
 * GET     /api/packages/:id          ->  show
 * PUT     /api/packages/:id          ->  upsert
 * PATCH   /api/packages/:id          ->  patch
 * DELETE  /api/packages/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _package = require('./package.model');

var _package2 = _interopRequireDefault(_package);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hotelCtrl = require('../hotel/hotel.controller.js');
var flightCtrl = require('../flight/flight.controller.js');
var eventCtrl = require('../event/event.controller.js');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      _fastJsonPatch2.default.apply(entity, patches, /*validate*/true);
    } catch (err) {
      return _promise2.default.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function getAllData(id) {
  return _q2.default.all([hotelCtrl.getAllHotels('33.88442690,-84.45836310', '2016-11-17', '2016-11-20'), flightCtrl.getAllFlights('33.88442690', '-84.45836310', 'JFK', '2016-11-17T19:00:00-05:00'), eventCtrl.getEventOffer('vvG1zZf11rd0EQ')]).then(function (data) {
    return silverPackage(data, id);
  });
}

function silverPackage(iter) {
  var hotel = _lodash2.default.orderBy(iter[0][0], function (a) {
    return Number(a.lowRate);
  });
  var flight = _lodash2.default.orderBy(iter[1], function (a) {
    return Number(a.baseFare);
  });
  return {
    hotel: hotel.slice(0, hotel.length / 4),
    flight: flight.slice(0, flight.length / 4),
    events: iter[2]
  };
}

// Gets a list of Packages
function index(req, res) {
  return _package2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Package from the DB
// ids are for packages type
// 0 = silver & 3 = vip
function show(req, res) {
  getAllData(req.params.id)
  // return Package.findById(req.params.id).exec()
  //   .then(handleEntityNotFound(res))
  .then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Package in the DB
function create(req, res) {
  return _package2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Package in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _package2.default.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Package in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _package2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Package from the DB
function destroy(req, res) {
  return _package2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=package.controller.js.map
