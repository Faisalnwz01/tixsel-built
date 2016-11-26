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

var _package2 = require('./package.model');

var _package3 = _interopRequireDefault(_package2);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hotelCtrl = require('../hotel/hotel.controller.js');
var flightCtrl = require('../flight/flight.controller.js');
var eventCtrl = require('../event/event.controller.js');
var iata = require('airport-codes');

var travelportHotelCtrl = require('../travelportHotel/travelportHotel.controller.js');

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

function lookUpAirportByLatLong(lat, long) {
  var airportLookupUrl = 'http://terminal2.expedia.com/x/geo/features?within=30km&lat=' + lat + '&lng=' + long + '&type=airport&verbose=3&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
  return (0, _requestPromise2.default)(airportLookupUrl);
}

function getAllData(id, lat, long, departureAirport, departureDate, eventId, arrivalDate, adults, childrens, eventCity, eventCountry) {
  console.log(eventCity, eventCountry);
  var arrivalAirport = iata.findWhere({
    city: eventCity,
    country: eventCountry.includes('United States') ? 'United States' : eventCountry
  }).get('iata');
  // return lookUpAirportByLatLong(lat, long).then(dat => {
  // let arrivalAirport = JSON.parse(dat)[0].tags.iata.airportCode.value;
  return _q2.default.all([travelportHotelCtrl.getAllHotels(arrivalAirport, formatDate(departureDate), formatDate(arrivalDate), lat, long, adults, childrens), eventCtrl.getEventOffer(eventId)]).then(function (hotels) {
    var hotelArr = hotels[0][0];
    return travelportHotelCtrl.getHotelRates(hotelArr, arrivalAirport, formatDate(departureDate), formatDate(arrivalDate), lat, long, adults, childrens).then(function (hot) {
      var mergedHotels = _lodash2.default.map(hot, function (item, i) {
        return _lodash2.default.merge(item, hotelArr[i]);
      });
      console.log('***************************************** Number of hotels returned totel = ' + mergedHotels.length);
      hotels[0][0] = _lodash2.default.filter(mergedHotels, function (o) {
        return o.state === 'fulfilled';
      });
      console.log('***************************************** Number of hotels returned fulfilled = ' + hotels[0][0].length);
      return hotels;
    });
  }).then(function (data) {
    return _q2.default.allSettled([_package(3, data, arrivalAirport, formatDate(departureDate), formatDate(arrivalDate), lat, long, adults, childrens), _package(2, data, arrivalAirport, formatDate(departureDate), formatDate(arrivalDate), lat, long, adults, childrens), _package(1, data, arrivalAirport, formatDate(departureDate), formatDate(arrivalDate), lat, long, adults, childrens), _package(0, data, arrivalAirport, formatDate(departureDate), formatDate(arrivalDate), lat, long, adults, childrens)]).then(function (results) {
      return {
        'Basic Package': results[0],
        'Middle Package': results[1],
        'Premium Package': results[2],
        'VIP Package': results[3]
      };
    });
  });
  // });
}

function _package(packageType, iter, arrivalAirport, departureDate, arrivalDate, lat, long, adults, children) {
  // let hotels = _.orderBy(iter[0][0], ['HotelRating', 'distanceToEvent', 'lowRate'], ['desc', 'asc', 'asc']);
  var hotels = _lodash2.default.orderBy(iter[0][0], ['lowRate'], ['desc']);
  debugger;
  var chunkedHotels = _lodash2.default.chunk(hotels, hotels.length / 4);
  chunkedHotels = chunkedHotels[packageType];
  // var flight = _.orderBy(iter[1], function (a) {
  //   return Number(a.totalFare);
  // });
  var events = _lodash2.default.cloneDeep(iter[1]);
  events.formatedOffers = [];
  events.offers = _lodash2.default.each(events.offers, function (ticketTypes) {
    _lodash2.default.each(ticketTypes.attributes.prices, function (eventPrice) {
      events.formatedOffers.push({
        tickeInfo: ticketTypes.attributes,
        prices: eventPrice
      });
    });
  });

  events.formatedOffers = _lodash2.default.orderBy(events.formatedOffers, function (a) {
    return -Number(a.prices.total);
  });

  if (events.formatedOffers.length > 3) {
    var chunk = _lodash2.default.chunk(events.formatedOffers, Math.ceil(events.formatedOffers.length / 4));
    events.formatedOffers = chunk[packageType];
  }

  return {
    hotel: chunkedHotels,
    // flight: _.chunk(flight, flight.length / 4)[0],
    events: events
  };
  // return travelportHotelCtrl.getHotelRates(chunkedHotels, arrivalAirport,
  //     formatDate(departureDate),
  //     formatDate(arrivalDate),
  //     lat, long, adults, children)
  //   .then(dat => {
  //     let mergedHotels = _.map(dat, function (item, i) {
  //       return _.merge(item, chunkedHotels[i]);
  //     });

  //     return defer.promise;
  //   })
  //   .catch(err => {
  //     console.warn(err, 'err occured ************************')
  //   });
}
// Gets a list of Packages
function index(req, res) {
  return _package3.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Package from the DB
// ids are for packages type
// 0 = gold & 3 = vip
function show(req, res) {
  getAllData(req.params.id, req.query.lat, req.query.long, req.query.departureAirport, req.query.departureDate, req.query.eventId, req.query.arrivalDate, Number(req.query.adults), Number(req.query.childrens), req.query.eventCity, req.query.eventCountry).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Package in the DB
function create(req, res) {
  return _package3.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Package in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _package3.default.findOneAndUpdate({
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
  return _package3.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Package from the DB
function destroy(req, res) {
  return _package3.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=package.controller.js.map
