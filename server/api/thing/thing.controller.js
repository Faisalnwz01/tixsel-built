/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  upsert
 * PATCH   /api/things/:id          ->  patch
 * DELETE  /api/things/:id          ->  destroy
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

var _thing = require('./thing.model');

var _thing2 = _interopRequireDefault(_thing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(sampleEventJSon);
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

// Gets a list of Things
function index(req, res) {
  return _thing2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Thing from the DB
function show(req, res) {
  return _thing2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Thing in the DB
function create(req, res) {
  return _thing2.default.create(req.body).then(respondWithResult(res, 201)).catch(handleError(res));
}

// Upserts the given Thing in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _thing2.default.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Thing in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _thing2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Thing from the DB
function destroy(req, res) {
  return _thing2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
var sampleEventJSon = {
  "numOfAttendees": "1 Room, 2 Attendees",
  "servicesType": "3",
  "departureAirport": {
    "name": "JFK",
    "value": "jfk"
  },
  "selectedArray": [{
    "name": "Coachella Music Festival",
    "type": "event",
    "id": "Z7r9jZ1Av0EGJ",
    "test": false,
    "url": "http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=1927326",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": true
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": true
    }],
    "sales": {
      "public": {
        "startDateTime": "1900-01-01T06:00:00Z",
        "startTBD": false,
        "endDateTime": "2017-04-17T07:59:20Z"
      }
    },
    "dates": {
      "start": {
        "localDate": "2017-04-14",
        "localTime": "23:59:20",
        "dateTime": "2017-04-15T04:59:20Z",
        "dateTBD": false,
        "dateTBA": false,
        "timeTBA": false,
        "noSpecificTime": false
      },
      "status": {
        "code": "onsale"
      }
    },
    "classifications": [{
      "primary": true,
      "segment": {
        "id": "KZFzniwnSyZfZ7v7nJ",
        "name": "Music"
      },
      "genre": {
        "id": "KnvZfZ7vAe6",
        "name": "Undefined"
      },
      "subGenre": {
        "id": "KZazBEonSMnZfZ7v6JI",
        "name": "Undefined"
      }
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/Z7r9jZ1Av0EGJ?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/ZFr9jZeF16?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/ZFr9jZdeea?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Empire Polo Field",
        "type": "venue",
        "id": "ZFr9jZdeea",
        "test": false,
        "locale": "en-us",
        "postalCode": "92201",
        "city": {
          "name": "Indio"
        },
        "state": {
          "name": "California",
          "stateCode": "CA"
        },
        "country": {
          "name": "United States",
          "countryCode": "US"
        },
        "address": {
          "line1": "81800 Avenue 51"
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/ZFr9jZdeea?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Coachella Music Festival",
        "type": "attraction",
        "id": "ZFr9jZeF16",
        "test": false,
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": true
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": true
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7nJ",
            "name": "Music"
          },
          "genre": {
            "id": "KnvZfZ7vAe6",
            "name": "Undefined"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v6JI",
            "name": "Undefined"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/ZFr9jZeF16?locale=en-us"
          }
        }
      }]
    },
    "value": "coachella music festival"
  }, {
    "name": "Coachella Music Festival",
    "type": "event",
    "id": "Z7r9jZ1Av0EGI",
    "test": false,
    "url": "http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=1927328",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": true
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": true
    }],
    "sales": {
      "public": {
        "startDateTime": "1900-01-01T06:00:00Z",
        "startTBD": false,
        "endDateTime": "2017-04-24T07:59:20Z"
      }
    },
    "dates": {
      "start": {
        "localDate": "2017-04-21",
        "localTime": "23:59:20",
        "dateTime": "2017-04-22T04:59:20Z",
        "dateTBD": false,
        "dateTBA": false,
        "timeTBA": false,
        "noSpecificTime": false
      },
      "status": {
        "code": "onsale"
      }
    },
    "classifications": [{
      "primary": true,
      "segment": {
        "id": "KZFzniwnSyZfZ7v7nJ",
        "name": "Music"
      },
      "genre": {
        "id": "KnvZfZ7vAe6",
        "name": "Undefined"
      },
      "subGenre": {
        "id": "KZazBEonSMnZfZ7v6JI",
        "name": "Undefined"
      }
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/Z7r9jZ1Av0EGI?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/ZFr9jZeF16?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/ZFr9jZdeea?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Empire Polo Field",
        "type": "venue",
        "id": "ZFr9jZdeea",
        "test": false,
        "locale": "en-us",
        "postalCode": "92201",
        "city": {
          "name": "Indio"
        },
        "state": {
          "name": "California",
          "stateCode": "CA"
        },
        "country": {
          "name": "United States",
          "countryCode": "US"
        },
        "address": {
          "line1": "81800 Avenue 51"
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/ZFr9jZdeea?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Coachella Music Festival",
        "type": "attraction",
        "id": "ZFr9jZeF16",
        "test": false,
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": true
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": true
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7nJ",
            "name": "Music"
          },
          "genre": {
            "id": "KnvZfZ7vAe6",
            "name": "Undefined"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v6JI",
            "name": "Undefined"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/ZFr9jZeF16?locale=en-us"
          }
        }
      }]
    },
    "value": "coachella music festival"
  }],
  "eventSearch": {
    "name": "Coachella Music Festival",
    "type": "event",
    "id": "Z7r9jZ1Av0EGJ",
    "test": false,
    "url": "http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=1927326",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": true
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": true
    }],
    "sales": {
      "public": {
        "startDateTime": "1900-01-01T06:00:00Z",
        "startTBD": false,
        "endDateTime": "2017-04-17T07:59:20Z"
      }
    },
    "dates": {
      "start": {
        "localDate": "2017-04-14",
        "localTime": "23:59:20",
        "dateTime": "2017-04-15T04:59:20Z",
        "dateTBD": false,
        "dateTBA": false,
        "timeTBA": false,
        "noSpecificTime": false
      },
      "status": {
        "code": "onsale"
      }
    },
    "classifications": [{
      "primary": true,
      "segment": {
        "id": "KZFzniwnSyZfZ7v7nJ",
        "name": "Music"
      },
      "genre": {
        "id": "KnvZfZ7vAe6",
        "name": "Undefined"
      },
      "subGenre": {
        "id": "KZazBEonSMnZfZ7v6JI",
        "name": "Undefined"
      }
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/Z7r9jZ1Av0EGJ?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/ZFr9jZeF16?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/ZFr9jZdeea?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Empire Polo Field",
        "type": "venue",
        "id": "ZFr9jZdeea",
        "test": false,
        "locale": "en-us",
        "postalCode": "92201",
        "city": {
          "name": "Indio"
        },
        "state": {
          "name": "California",
          "stateCode": "CA"
        },
        "country": {
          "name": "United States",
          "countryCode": "US"
        },
        "address": {
          "line1": "81800 Avenue 51"
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/ZFr9jZdeea?locale=en-us"
          }
        },
        "location": {
          "latitude": 33.6782429,
          "longitude": -116.2371576
        }
      }],
      "attractions": [{
        "name": "Coachella Music Festival",
        "type": "attraction",
        "id": "ZFr9jZeF16",
        "test": false,
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": true
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/ab4/6367448e-7474-4650-bd2d-02a8f7166ab4_106161_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": true
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7nJ",
            "name": "Music"
          },
          "genre": {
            "id": "KnvZfZ7vAe6",
            "name": "Undefined"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v6JI",
            "name": "Undefined"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/ZFr9jZeF16?locale=en-us"
          }
        }
      }]
    }
  },
  "checkin": "2017-04-13T00:00:00.000Z",
  "checkout": "2017-04-16T00:00:00.000Z"
};
//# sourceMappingURL=thing.controller.js.map
