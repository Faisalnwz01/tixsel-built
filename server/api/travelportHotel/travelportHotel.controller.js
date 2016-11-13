/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/travelportHotels              ->  index
 * POST    /api/travelportHotels              ->  create
 * GET     /api/travelportHotels/:id          ->  show
 * PUT     /api/travelportHotels/:id          ->  upsert
 * PATCH   /api/travelportHotels/:id          ->  patch
 * DELETE  /api/travelportHotels/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.getHotelRates = getHotelRates;
exports.getAllHotels = getAllHotels;
exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _travelportHotel = require('./travelportHotel.model');

var _travelportHotel2 = _interopRequireDefault(_travelportHotel);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _uapiJson = require('uapi-json');

var _uapiJson2 = _interopRequireDefault(_uapiJson);

var _uAPI = require('../../config/uAPI');

var _uAPI2 = _interopRequireDefault(_uAPI);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _geolib = require('geolib');

var _geolib2 = _interopRequireDefault(_geolib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HotelService = _uapiJson2.default.createHotelService({
  auth: _uAPI2.default,
  debug: 2,
  production: false
});

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    console.log('******************** returning response ************************');
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

function searchForHotels(location, checkInDate, checkOutDate, lat, long, adults, children) {
  var search = {
    location: location,
    startDate: checkInDate,
    endDate: checkOutDate,
    currency: 'USD',
    MaxWait: 9999,
    MaxProperties: 100,
    rooms: [{
      adults: adults,
      children: children
    }],
    rating: [3, 4, 5]
  };
  return HotelService.search(search).then(function (res) {
    var sorted = _lodash2.default.sortBy(res.hotels, [function (o) {
      var distanceToEvent = _geolib2.default.getDistance({
        latitude: lat,
        longitude: long
      }, {
        latitude: o.Location.lat,
        longitude: o.Location.lng
      });
      o.lowRate = o.Rates[0].ApproximateMinimumStayAmount.value;
      o.distanceToEvent = _geolib2.default.convertUnit('mi', distanceToEvent);
      return o.distanceToEvent;
    }]);
    return sorted;
  }, function (error) {
    return error;
  });
}

function getHotelRates(hotels, location, checkInDate, checkOutDate, lat, long, adults, children) {
  var search = {
    location: location,
    startDate: checkInDate,
    endDate: checkOutDate,
    currency: 'USD',
    MaxWait: 9999,
    MaxProperties: 100,
    rooms: [{
      adults: adults,
      children: children
    }],
    rating: [3, 4, 5]
  };
  var ratesPromise = [];
  _lodash2.default.each(hotels, function (hotel, i) {
    var hotelMediaParams = hotel;
    var rateReq = (0, _assign2.default)({}, hotelMediaParams, search);
    ratesPromise.push(HotelService.rates(rateReq));
  });
  console.log(ratesPromise);
  return _q2.default.allSettled(ratesPromise);
}

function getAllHotels(location, checkInDate, checkOutDate, lat, long, adults, children) {
  return _q2.default.all([searchForHotels(location, checkInDate, checkOutDate, lat, long, adults, children)]);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of TravelportHotels
function index(req, res) {
  console.log(req.body);
  return _travelportHotel2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single TravelportHotel from the api
// lat = '33.924539';
// long = '-118.356206';
function show(req, res) {
  return _q2.default.all([searchForHotels(req.params.id, (0, _moment2.default)().add(30, 'days').format('YYYY-MM-DD'), (0, _moment2.default)().add(35, 'days').format('YYYY-MM-DD'), '33.924539', '-118.356206', 1, 0)]).then(function (dat) {
    return res.status(200).json(dat[0]);
  }).catch(handleError(res));

  // return HotelService.search({
  //   location: req.params.id,
  //   startDate: moment().add(30, 'days').format('YYYY-MM-DD'),
  //   endDate: moment().add(35, 'days').format('YYYY-MM-DD'),
  //   currency: 'USD',
  //   MaxWait: 9999,
  //   MaxProperties: 10,
  //   rooms: [{
  //     adults: 1,
  //   }],
  //   rating: [3, 5],
  // }).then(
  //   res => {
  //     console.log('****************** hit resposne *************************', res)
  //     respondWithResult(res);
  //   },
  //   error => handleError(error)
  // );
}

// Creates a new TravelportHotel in the DB
function create(req, res) {
  return _travelportHotel2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given TravelportHotel in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _travelportHotel2.default.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing TravelportHotel in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _travelportHotel2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a TravelportHotel from the DB
function destroy(req, res) {
  return _travelportHotel2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=travelportHotel.controller.js.map
