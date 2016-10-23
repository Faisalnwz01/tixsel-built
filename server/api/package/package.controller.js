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

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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

function formatDate(date) {
  return (0, _moment2.default)(date).format('YYYY-MM-DD');
}

function getAllData(id, lat, long, departureAirport, departureDate, eventId, arrivalDate) {
  return _q2.default.all([hotelCtrl.getAllHotels(lat + ',' + long, formatDate(departureDate), formatDate(arrivalDate)), flightCtrl.getAllFlights(lat, long, departureAirport, (0, _moment2.default)(departureDate).format()), eventCtrl.getEventOffer(eventId)]).then(function (data) {
    return {
      gold: goldPackage(data),
      backstage: backstagePackage(data),
      'red carpet': redcarpetPackage(data),
      vip: vipPackage(data)
    };
  });
}

function vipPackage(iter) {
  var hotel = _lodash2.default.orderBy(iter[0][0], ['hotelStarRating', 'proximityDistanceInMiles', 'percentRecommended', 'lowRate'], ['desc', 'asc', 'desc', 'asc']);
  var flight = _lodash2.default.orderBy(iter[1], function (a) {
    return [a.segments.length, Number(a.totalFare)];
  });
  var events = iter[2];
  // _.map(events.offers, function (offer) {
  //   offer.attributes.prices = _.chunk(offer.attributes.prices, offer.attributes.prices.length / 4);
  // });
  return {
    hotel: _lodash2.default.chunk(hotel, hotel.length / 4)[0],
    flight: _lodash2.default.chunk(flight, flight.length / 4)[0],
    events: events
  };
}
function backstagePackage(iter) {
  var hotel = _lodash2.default.orderBy(iter[0][0], ['hotelStarRating', 'proximityDistanceInMiles', 'percentRecommended', 'lowRate'], ['desc', 'asc', 'desc', 'asc']);
  var flight = _lodash2.default.orderBy(iter[1], function (a) {
    return [a.segments.length, Number(a.totalFare)];
  });
  var events = iter[2];
  // _.map(events.offers, function (offer) {
  //   offer.attributes.prices = _.chunk(offer.attributes.prices, offer.attributes.prices.length / 4);
  // });
  return {
    hotel: _lodash2.default.chunk(hotel, hotel.length / 4)[2],
    flight: _lodash2.default.chunk(flight, flight.length / 4)[2],
    events: events
  };
}
function redcarpetPackage(iter) {
  var hotel = _lodash2.default.orderBy(iter[0][0], ['hotelStarRating', 'proximityDistanceInMiles', 'percentRecommended', 'lowRate'], ['desc', 'asc', 'desc', 'asc']);
  var flight = _lodash2.default.orderBy(iter[1], function (a) {
    return [a.segments.length, Number(a.totalFare)];
  });
  var events = iter[2];
  // _.map(events.offers, function (offer) {
  //   offer.attributes.prices = _.chunk(offer.attributes.prices, offer.attributes.prices.length / 4);
  // });
  return {
    hotel: _lodash2.default.chunk(hotel, hotel.length / 4)[1],
    flight: _lodash2.default.chunk(flight, flight.length / 4)[1],
    events: events
  };
}

function goldPackage(iter) {
  var hotel = _lodash2.default.orderBy(iter[0][0], function (a) {
    return Number(a.lowRate);
  });
  var flight = _lodash2.default.orderBy(iter[1], function (a) {
    return Number(a.totalFare);
  });
  var events = iter[2];
  // _.map(events.offers, function (offer) {
  //   offer.attributes.prices = _.last(_.chunk(offer.attributes.prices, Math.ceil(offer.attributes.prices.length / 4)));
  // });
  return {
    hotel: _lodash2.default.chunk(hotel, hotel.length / 4)[0],
    flight: _lodash2.default.chunk(flight, flight.length / 4)[0],
    events: events
  };
}
// Gets a list of Packages
function index(req, res) {
  return _package2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Package from the DB
// ids are for packages type
// 0 = gold & 3 = vip
function show(req, res) {
  // req.query.lat, req.query.long, req.query.departureAirport, req.query.departureDate,
  // req.query.eventId, req.query.arrivalDate
  getAllData(req.params.id, req.query.lat, req.query.long, req.query.departureAirport, req.query.departureDate, req.query.eventId, req.query.arrivalDate)
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
