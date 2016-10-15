/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/events              ->  index
 * POST    /api/events              ->  create
 * GET     /api/events/:id          ->  show
 * PUT     /api/events/:id          ->  upsert
 * PATCH   /api/events/:id          ->  patch
 * DELETE  /api/events/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.offers = offers;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _event = require('./event.model');

var _event2 = _interopRequireDefault(_event);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

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

// Gets a list of Events matching a given key
function index(req, res) {
  var eventUrl = 'http://app.ticketmaster.com/discovery/v2/events.json?keyword=' + req.query.key + '&countryCode=US&apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
  return _requestPromise2.default.get(eventUrl).then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Event from the DB
function show(req, res) {
  var eventDetailUrl = 'http://app.ticketmaster.com/discovery/v2/events/' + req.params.id + '.json?apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
  return _requestPromise2.default.get(eventDetailUrl).then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Event from the DB
function offers(req, res) {
  var eventDetailUrl = 'http://app.ticketmaster.com/commerce/v2/events/' + req.params.id + '/offers.json?apikey=g4sXxf0ioySFxO0FQFYnGMEoAwW1uMoQ';
  return _requestPromise2.default.get(eventDetailUrl).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Event in the DB
function create(req, res) {
  return _event2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Event in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _event2.default.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Event in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Event from the DB
function destroy(req, res) {
  return _event2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=event.controller.js.map
