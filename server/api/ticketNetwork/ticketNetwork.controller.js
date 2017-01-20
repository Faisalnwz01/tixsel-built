/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/ticketNetworks              ->  index
 * POST    /api/ticketNetworks              ->  create
 * GET     /api/ticketNetworks/:id          ->  show
 * PUT     /api/ticketNetworks/:id          ->  upsert
 * PATCH   /api/ticketNetworks/:id          ->  patch
 * DELETE  /api/ticketNetworks/:id          ->  destroy
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

var _ticketNetwork = require('./ticketNetwork.model');

var _ticketNetwork2 = _interopRequireDefault(_ticketNetwork);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _xml2json = require('xml2json');

var _xml2json2 = _interopRequireDefault(_xml2json);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// Gets a list of TicketNetworks
function index(req, res) {
  return _requestPromise2.default.get('http://tnwebservices-test.ticketnetwork.com/TNWebservice/v3.2/TNWebserviceStringInputs.asmx/SearchEvents?websiteConfigID=23245&searchTerms=' + req.query.key + '&whereClause=&orderByClause=Date').then(function (dat) {
    console.log('got this back for the searched term ' + dat);
    return _xml2json2.default.toJson(dat);
  }).then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single TicketNetwork from the DB
function show(req, res) {
  return _ticketNetwork2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new TicketNetwork in the DB
function create(req, res) {
  return _ticketNetwork2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given TicketNetwork in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _ticketNetwork2.default.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true
  }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing TicketNetwork in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _ticketNetwork2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a TicketNetwork from the DB
function destroy(req, res) {
  return _ticketNetwork2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=ticketNetwork.controller.js.map
