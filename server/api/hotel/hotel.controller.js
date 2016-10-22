/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/hotels              ->  index
 * POST    /api/hotels              ->  create
 * GET     /api/hotels/:id          ->  show
 * PUT     /api/hotels/:id          ->  upsert
 * PATCH   /api/hotels/:id          ->  patch
 * DELETE  /api/hotels/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.getAllHotels = getAllHotels;
exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _hotel = require('./hotel.model');

var _hotel2 = _interopRequireDefault(_hotel);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expediaSearch = 'http://terminal2.expedia.com/x/mhotels/search?';
var expediaPrice = 'http://terminal2.expedia.com/x/mhotels/offers?';

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

function searchForHotelsExpedia(location, checkInDate, checkOutDate) {
  console.log(expediaSearch + 'city=' + location + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate + '&room1=2&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH');
  var options = {
    uri: expediaSearch + 'city=' + location + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate + '&room1=2&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  return (0, _requestPromise2.default)(options).then(function (data) {
    if (data.errors) {
      throw new Error(data.errors);
    }
    return data.hotelList;
  }).catch(function (err) {
    console.error((0, _stringify2.default)(err)); // This will print any error that was thrown in the previous error handler.
    return err;
  });
}

function priceForHotels(hotelId, checkInDate, checkOutDate) {
  var url = expediaPrice + 'hotelId=' + hotelId + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate + '&room1=2&apikey=BAGEROtURYYysKTHQIE7HK5m0tOFIjSH';
  return (0, _requestPromise2.default)(url).then(function (data) {
    return data;
  });
}

function getAllHotels(location, checkInDate, checkOutDate) {
  return _q2.default.all([searchForHotelsExpedia(location, checkInDate, checkOutDate)]);
}

// Gets a list of Hotels
function index(req, res) {
  getAllHotels(req.query.location, req.query.checkInDate, req.query.checkOutDate).then(function (data) {
    return _lodash2.default.each(data[0], function (hotel) {
      hotel.rate = hotel.lowRateInfo;
    });
  }).then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Hotel from the DB
function show(req, res) {
  return _hotel2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Hotel in the DB
function create(req, res) {
  return _hotel2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Hotel in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _hotel2.default.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Hotel in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _hotel2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Hotel from the DB
function destroy(req, res) {
  return _hotel2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=hotel.controller.js.map
