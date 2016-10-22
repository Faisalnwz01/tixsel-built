/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/flights              ->  index
 * POST    /api/flights              ->  create
 * GET     /api/flights/:id          ->  show
 * PUT     /api/flights/:id          ->  upsert
 * PATCH   /api/flights/:id          ->  patch
 * DELETE  /api/flights/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.getAllFlights = getAllFlights;
exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _flight = require('./flight.model');

var _flight2 = _interopRequireDefault(_flight);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      entity = JSON.parse(entity);
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

function lookUpAirportByLatLong(lat, long) {
  var airportLookupUrl = 'http://terminal2.expedia.com/x/geo/features?within=30km&lat=' + lat + '&lng=' + long + '&type=airport&verbose=3&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
  return (0, _requestPromise2.default)(airportLookupUrl);
}

function geocode(address) {
  var geocodeUrl = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address;
  return (0, _requestPromise2.default)(geocodeUrl).then(function (data) {
    return data.data;
  });
}

function getAllFlights(lat, long, departureAirport, departureDate, arrivalAirport) {
  var flightsUrl = 'http://terminal2.expedia.com/x/mflights/search?';
  if (!arrivalAirport) {
    return lookUpAirportByLatLong(lat, long).then(function (data) {
      arrivalAirport = JSON.parse(data)[0].tags.iata.airportCode.value;
      return searchFlights(flightsUrl, departureAirport, arrivalAirport, departureDate);
    });
  } else {
    return searchFlights(flightsUrl, departureAirport, arrivalAirport, departureDate);
  }
}

function searchFlights(flightsUrl, departureAirport, arrivalAirport, departureDate) {
  var url = flightsUrl + 'departureAirport=' + departureAirport + '&arrivalAirport=' + arrivalAirport + '&departureDate=' + departureDate + '&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
  return (0, _requestPromise2.default)(url).then(function (flightRes) {
    var fr = JSON.parse(flightRes);
    var a = _lodash2.default.map(fr.offers, function (offer) {
      offer.segments = legsLookup(offer.legIds[0], fr);
      return offer;
    });
    return a;
  });
}

// Gets a list of Flights
function index(req, res) {
  getAllFlights(req.query.lat, req.query.long, req.query.departureAirport, req.query.departureDate).then(function (r) {
    return (0, _stringify2.default)(r);
  }).then(respondWithResult(res)).catch(handleError(res));
}

function legsLookup(id, flights) {
  var property = '';
  flights.legs.forEach(function (leg) {
    if (leg.legId === id) {
      property = leg.segments;
    }
  });
  return property;
}

// Gets a single Flight from the DB
function show(req, res) {
  return _flight2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Flight in the DB
function create(req, res) {
  return _flight2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Flight in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _flight2.default.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Flight in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _flight2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Flight from the DB
function destroy(req, res) {
  return _flight2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=flight.controller.js.map
