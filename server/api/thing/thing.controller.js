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
    "name": "Pokemon Symphonic Evolutions With The Dallas Pops",
    "type": "event",
    "id": "vvG1YZfa3mnwJB",
    "test": false,
    "url": "http://ticketmaster.com/event/0C005094AEAB29BA",
    "locale": "en-us",
    "images": [{
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dbimages/243678a.jpg",
      "width": 205,
      "height": 115,
      "fallback": false
    }],
    "sales": {
      "public": {
        "startDateTime": "2016-05-13T15:00:00Z",
        "startTBD": false,
        "endDateTime": "2016-10-29T20:00:00Z"
      },
      "presales": [{
        "startDateTime": "2016-05-09T15:00:00Z",
        "endDateTime": "2016-05-13T04:59:00Z",
        "name": "Ticketmaster and VIP Presale"
      }]
    },
    "dates": {
      "start": {
        "localDate": "2016-10-29",
        "localTime": "19:00:00",
        "dateTime": "2016-10-30T00:00:00Z",
        "dateTBD": false,
        "dateTBA": false,
        "timeTBA": false,
        "noSpecificTime": false
      },
      "timezone": "America/Chicago",
      "status": {
        "code": "onsale"
      }
    },
    "classifications": [{
      "primary": true,
      "segment": {
        "id": "KZFzniwnSyZfZ7v7na",
        "name": "Arts & Theatre"
      },
      "genre": {
        "id": "KnvZfZ7v7nJ",
        "name": "Classical"
      },
      "subGenre": {
        "id": "KZazBEonSMnZfZ7v7nI",
        "name": "Symphonic"
      }
    }],
    "promoter": {
      "id": "494",
      "name": "PROMOTED BY VENUE",
      "description": "PROMOTED BY VENUE / NTL / USA"
    },
    "info": "Children over 2 years need a ticket.",
    "priceRanges": [{
      "type": "standard",
      "currency": "USD",
      "min": 25,
      "max": 70
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/vvG1YZfa3mnwJB?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/K8vZ917KMdf?locale=en-us"
      }, {
        "href": "/discovery/v2/attractions/K8vZ917o2K7?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/KovZpZAFFvnA?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Music Hall At Fair Park",
        "type": "venue",
        "id": "KovZpZAFFvnA",
        "test": false,
        "url": "http://ticketmaster.com/venue/98325",
        "locale": "en-us",
        "postalCode": "75210",
        "timezone": "America/Chicago",
        "city": {
          "name": "Dallas"
        },
        "state": {
          "name": "Texas",
          "stateCode": "TX"
        },
        "country": {
          "name": "United States Of America",
          "countryCode": "US"
        },
        "address": {
          "line1": "909 1st Ave"
        },
        "location": {
          "longitude": "-96.76590197",
          "latitude": "32.78037016"
        },
        "markets": [{
          "id": "5"
        }],
        "dmas": [{
          "id": 212
        }, {
          "id": 218
        }, {
          "id": 261
        }, {
          "id": 326
        }, {
          "id": 386
        }, {
          "id": 405
        }, {
          "id": 415
        }],
        "social": {
          "twitter": {
            "handle": "@dsmusicals"
          }
        },
        "boxOfficeInfo": {
          "phoneNumberDetail": "(214) 565-1116",
          "openHoursDetail": "The Music Hall at Fair Park does not operate a daily box office. For most events, the ticket office opens 90 minutes prior to show time. Call the Music Hall at (214) 565-1116 for specific event ticketing information. For Dallas Summer Musicals box office only, call (214) 691-7200.",
          "acceptedPaymentDetail": "Payments accepted are at the discretion of the show’s producer. An ATM is available in the lobby.",
          "willCallDetail": "Ticketmaster will call orders may be picked up as early as 90 minutes prior to show time at the box office in the main lobby."
        },
        "parkingDetail": "For most events, parking is available on the Fair Grounds without additional charge. Valet parking may be available for an additional fee. Year-round, there is a paid parking lot available across Parry Ave. from the Music Hall (between 1st and 2nd Aves). Parking is limited and subject to availability. Arrive early for best parking. During the State Fair of Texas (Sep. – Oct.), there is a fee associated with all parking, both on the Fair Grounds and in surrounding lots. The Music Hall does not have a dedicated lot and no spaces are reserved for Music Hall patrons. Patrons will compete with the general public for parking spaces. During the State Fair of Texas there is often traffic congestion and parking difficulties, especially during special events and football games. Visit www.bigtex.com for a complete calendar of State Fair events and plan accordingly.",
        "accessibleSeatingDetail": "The Music Hall at Fair Park does not operate a daily box office. Events are staffed on the day of event, 90 minutes prior to each performance (generally). Any ADA requests will be handled by the producer of the show.",
        "generalInfo": {
          "generalRule": "No cameras or recording devices allowed inside the theatre.",
          "childRule": "Rules regarding admission for children are at the discretion of the show’s producer. Booster seats are available to rent for a nominal fee (while supplies last)."
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/KovZpZAFFvnA?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Pokemon Symphonic Evolutions",
        "type": "attraction",
        "id": "K8vZ917KMdf",
        "test": false,
        "url": "http://ticketmaster.com/artist/2008305",
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": false
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": false
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7na",
            "name": "Arts & Theatre"
          },
          "genre": {
            "id": "KnvZfZ7v7nJ",
            "name": "Classical"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v7nI",
            "name": "Symphonic"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/K8vZ917KMdf?locale=en-us"
          }
        }
      }, {
        "name": "Dallas Pops",
        "type": "attraction",
        "id": "K8vZ917o2K7",
        "test": false,
        "url": "http://ticketmaster.com/artist/1869110",
        "locale": "en-us",
        "images": [{
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/f7b/ef64d601-8740-43cd-86ea-ed9b392e4f7b_105961_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": true
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7na",
            "name": "Arts & Theatre"
          },
          "genre": {
            "id": "KnvZfZ7v7nJ",
            "name": "Classical"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v7nI",
            "name": "Symphonic"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/K8vZ917o2K7?locale=en-us"
          }
        }
      }]
    },
    "value": "pokemon symphonic evolutions with the dallas pops"
  }, {
    "name": "Pokemon Symphonic Evolutions",
    "type": "event",
    "id": "vvG1zZf11rd0EQ",
    "test": false,
    "url": "http://ticketmaster.com/event/0E0050A29E0E49DA",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": false
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": false
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": false
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": false
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": false
    }],
    "sales": {
      "public": {
        "startDateTime": "2016-05-06T14:00:00Z",
        "startTBD": false,
        "endDateTime": "2016-11-19T21:30:00Z"
      },
      "presales": [{
        "startDateTime": "2016-05-04T14:00:00Z",
        "endDateTime": "2016-05-06T02:00:00Z",
        "name": "PROMOTER PRESALE"
      }]
    },
    "dates": {
      "start": {
        "localDate": "2016-11-19",
        "localTime": "19:30:00",
        "dateTime": "2016-11-20T00:30:00Z",
        "dateTBD": false,
        "dateTBA": false,
        "timeTBA": false,
        "noSpecificTime": false
      },
      "timezone": "America/New_York",
      "status": {
        "code": "onsale"
      }
    },
    "classifications": [{
      "primary": true,
      "segment": {
        "id": "KZFzniwnSyZfZ7v7na",
        "name": "Arts & Theatre"
      },
      "genre": {
        "id": "KnvZfZ7v7nJ",
        "name": "Classical"
      },
      "subGenre": {
        "id": "KZazBEonSMnZfZ7v7nI",
        "name": "Symphonic"
      }
    }],
    "promoter": {
      "id": "494",
      "name": "PROMOTED BY VENUE",
      "description": "PROMOTED BY VENUE / NTL / USA"
    },
    "info": "All persons regardless of age must have a ticket for admission. 4 years and younger prohibited. For Accessible seating please call 770.916.2852. No Cameras/Audio/Video.",
    "pleaseNote": "All persons regardless of age must have a ticket for admission. 4 years and younger prohibited. For Accessible seating please call 770.916.2852. No Cameras/Audio/Video.",
    "priceRanges": [{
      "type": "standard",
      "currency": "USD",
      "min": 39,
      "max": 125
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/vvG1zZf11rd0EQ?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/K8vZ917KMdf?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/KovZpa3j7e?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Cobb Energy Performing Arts Centre",
        "type": "venue",
        "id": "KovZpa3j7e",
        "test": false,
        "url": "http://ticketmaster.com/venue/115457",
        "locale": "en-us",
        "postalCode": "30339",
        "timezone": "America/New_York",
        "city": {
          "name": "Atlanta"
        },
        "state": {
          "name": "Georgia",
          "stateCode": "GA"
        },
        "country": {
          "name": "United States Of America",
          "countryCode": "US"
        },
        "address": {
          "line1": "2800 Cobb Galleria Parkway"
        },
        "location": {
          "longitude": "-84.45836310",
          "latitude": "33.88442690"
        },
        "markets": [{
          "id": "10"
        }],
        "dmas": [{
          "id": 220
        }, {
          "id": 221
        }, {
          "id": 258
        }, {
          "id": 327
        }, {
          "id": 384
        }],
        "social": {
          "twitter": {
            "handle": "@cobbenergypac"
          }
        },
        "boxOfficeInfo": {
          "phoneNumberDetail": "770-916-2800",
          "openHoursDetail": "Mon-Fri 10am-6pm Sat 10am-2pm Sun Closed",
          "acceptedPaymentDetail": "Cash, Visa, MC, Discover, & American Express",
          "willCallDetail": "Box Office will be open until curtain time on performance days, and will open at noon on Sundays where there is a scheduled performance. Customer must present the actual credit card used to place order and a photo ID"
        },
        "parkingDetail": "Official Centre parking is available for $6 at the venue parking deck and surface lot.",
        "accessibleSeatingDetail": "This is an accessible venue. Please contact box office at 770.916.2852",
        "generalInfo": {
          "generalRule": "No outside food or drink is permitted. No cameras or recording devices. Only trained service animals are permitted in the Centre.",
          "childRule": "All patrons must have a ticket, regardless of age. Children under four are not admitted except for specific family programs and all children must have a ticket. Please be aware that not all events are suitable for Children and plan accordingly. Children who are disruptive may be asked to leave the theatre."
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/KovZpa3j7e?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Pokemon Symphonic Evolutions",
        "type": "attraction",
        "id": "K8vZ917KMdf",
        "test": false,
        "url": "http://ticketmaster.com/artist/2008305",
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": false
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": false
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7na",
            "name": "Arts & Theatre"
          },
          "genre": {
            "id": "KnvZfZ7v7nJ",
            "name": "Classical"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v7nI",
            "name": "Symphonic"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/K8vZ917KMdf?locale=en-us"
          }
        }
      }]
    },
    "value": "pokemon symphonic evolutions"
  }, {
    "name": "Pokemon: Symphonic Evolutions",
    "type": "event",
    "id": "Z7r9jZ1AvP804",
    "test": false,
    "url": "http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=1950915",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": true
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": true
    }],
    "sales": {
      "public": {
        "startDateTime": "1900-01-01T06:00:00Z",
        "startTBD": false,
        "endDateTime": "2016-12-06T01:00:00Z"
      }
    },
    "dates": {
      "start": {
        "localDate": "2016-12-03",
        "localTime": "20:00:00",
        "dateTime": "2016-12-04T02:00:00Z",
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
        "id": "KZFzniwnSyZfZ7v7na",
        "name": "Arts & Theatre"
      }
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/Z7r9jZ1AvP804?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/Z7r9jZa6Sy?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/ZFr9jZAAe6?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Knight Concert Hall-Adrienne Arsht PAC",
        "type": "venue",
        "id": "ZFr9jZAAe6",
        "test": true,
        "locale": "en-us",
        "postalCode": "33132",
        "city": {
          "name": "Miami"
        },
        "state": {
          "name": "Florida",
          "stateCode": "FL"
        },
        "country": {
          "name": "United States",
          "countryCode": "US"
        },
        "address": {
          "line1": "1444 Biscayne Blvd",
          "line2": "Suite 202"
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/ZFr9jZAAe6?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Pokemon: Symphonic Evolutions",
        "type": "attraction",
        "id": "Z7r9jZa6Sy",
        "test": false,
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": true
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": true
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7na",
            "name": "Arts & Theatre"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/Z7r9jZa6Sy?locale=en-us"
          }
        }
      }]
    },
    "value": "pokemon: symphonic evolutions"
  }, {
    "name": "Pokemon: Symphonic Evolutions",
    "type": "event",
    "id": "Z7r9jZ1AvP3oY",
    "test": false,
    "url": "http://www.ticketsnow.com/InventoryBrowse/TicketList.aspx?PID=1952470",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": true
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": true
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": true
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": true
    }],
    "sales": {
      "public": {
        "startDateTime": "1900-01-01T06:00:00Z",
        "startTBD": false,
        "endDateTime": "2017-01-10T01:30:00Z"
      }
    },
    "dates": {
      "start": {
        "localDate": "2017-01-07",
        "localTime": "19:30:00",
        "dateTime": "2017-01-08T01:30:00Z",
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
        "id": "KZFzniwnSyZfZ7v7na",
        "name": "Arts & Theatre"
      }
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/Z7r9jZ1AvP3oY?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/Z7r9jZa6Sy?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/ZFr9jZkae1?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Michael & Susan Dell Hall",
        "type": "venue",
        "id": "ZFr9jZkae1",
        "test": false,
        "locale": "en-us",
        "postalCode": "78701",
        "city": {
          "name": "Austin"
        },
        "state": {
          "name": "Texas",
          "stateCode": "TX"
        },
        "country": {
          "name": "United States",
          "countryCode": "US"
        },
        "address": {
          "line1": "701 W. Riverside Drive"
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/ZFr9jZkae1?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Pokemon: Symphonic Evolutions",
        "type": "attraction",
        "id": "Z7r9jZa6Sy",
        "test": false,
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": true
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": true
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": true
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/c/2a8/2e8badd2-d540-49e6-9273-09e813c412a8_105741_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": true
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7na",
            "name": "Arts & Theatre"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/Z7r9jZa6Sy?locale=en-us"
          }
        }
      }]
    },
    "value": "pokemon: symphonic evolutions"
  }],
  "eventSearch": {
    "name": "Pokemon Symphonic Evolutions",
    "type": "event",
    "id": "vvG1zZf11rd0EQ",
    "test": false,
    "url": "http://ticketmaster.com/event/0E0050A29E0E49DA",
    "locale": "en-us",
    "images": [{
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RECOMENDATION_16_9.jpg",
      "width": 100,
      "height": 56,
      "fallback": false
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_ARTIST_PAGE_3_2.jpg",
      "width": 305,
      "height": 203,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_LANDSCAPE_16_9.jpg",
      "width": 1136,
      "height": 639,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_16_9.jpg",
      "width": 1024,
      "height": 576,
      "fallback": false
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_3_2.jpg",
      "width": 640,
      "height": 427,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_16_9.jpg",
      "width": 640,
      "height": 360,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_EVENT_DETAIL_PAGE_16_9.jpg",
      "width": 205,
      "height": 115,
      "fallback": false
    }, {
      "ratio": "4_3",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_CUSTOM.jpg",
      "width": 305,
      "height": 225,
      "fallback": false
    }, {
      "ratio": "3_2",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_3_2.jpg",
      "width": 1024,
      "height": 683,
      "fallback": false
    }, {
      "ratio": "16_9",
      "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_LARGE_16_9.jpg",
      "width": 2048,
      "height": 1152,
      "fallback": false
    }],
    "sales": {
      "public": {
        "startDateTime": "2016-05-06T14:00:00Z",
        "startTBD": false,
        "endDateTime": "2016-11-19T21:30:00Z"
      },
      "presales": [{
        "startDateTime": "2016-05-04T14:00:00Z",
        "endDateTime": "2016-05-06T02:00:00Z",
        "name": "PROMOTER PRESALE"
      }]
    },
    "dates": {
      "start": {
        "localDate": "2016-11-19",
        "localTime": "19:30:00",
        "dateTime": "2016-11-20T00:30:00Z",
        "dateTBD": false,
        "dateTBA": false,
        "timeTBA": false,
        "noSpecificTime": false
      },
      "timezone": "America/New_York",
      "status": {
        "code": "onsale"
      }
    },
    "classifications": [{
      "primary": true,
      "segment": {
        "id": "KZFzniwnSyZfZ7v7na",
        "name": "Arts & Theatre"
      },
      "genre": {
        "id": "KnvZfZ7v7nJ",
        "name": "Classical"
      },
      "subGenre": {
        "id": "KZazBEonSMnZfZ7v7nI",
        "name": "Symphonic"
      }
    }],
    "promoter": {
      "id": "494",
      "name": "PROMOTED BY VENUE",
      "description": "PROMOTED BY VENUE / NTL / USA"
    },
    "info": "All persons regardless of age must have a ticket for admission. 4 years and younger prohibited. For Accessible seating please call 770.916.2852. No Cameras/Audio/Video.",
    "pleaseNote": "All persons regardless of age must have a ticket for admission. 4 years and younger prohibited. For Accessible seating please call 770.916.2852. No Cameras/Audio/Video.",
    "priceRanges": [{
      "type": "standard",
      "currency": "USD",
      "min": 39,
      "max": 125
    }],
    "_links": {
      "self": {
        "href": "/discovery/v2/events/vvG1zZf11rd0EQ?locale=en-us"
      },
      "attractions": [{
        "href": "/discovery/v2/attractions/K8vZ917KMdf?locale=en-us"
      }],
      "venues": [{
        "href": "/discovery/v2/venues/KovZpa3j7e?locale=en-us"
      }]
    },
    "_embedded": {
      "venues": [{
        "name": "Cobb Energy Performing Arts Centre",
        "type": "venue",
        "id": "KovZpa3j7e",
        "test": false,
        "url": "http://ticketmaster.com/venue/115457",
        "locale": "en-us",
        "postalCode": "30339",
        "timezone": "America/New_York",
        "city": {
          "name": "Atlanta"
        },
        "state": {
          "name": "Georgia",
          "stateCode": "GA"
        },
        "country": {
          "name": "United States Of America",
          "countryCode": "US"
        },
        "address": {
          "line1": "2800 Cobb Galleria Parkway"
        },
        "location": {
          "longitude": "-84.45836310",
          "latitude": "33.88442690"
        },
        "markets": [{
          "id": "10"
        }],
        "dmas": [{
          "id": 220
        }, {
          "id": 221
        }, {
          "id": 258
        }, {
          "id": 327
        }, {
          "id": 384
        }],
        "social": {
          "twitter": {
            "handle": "@cobbenergypac"
          }
        },
        "boxOfficeInfo": {
          "phoneNumberDetail": "770-916-2800",
          "openHoursDetail": "Mon-Fri 10am-6pm Sat 10am-2pm Sun Closed",
          "acceptedPaymentDetail": "Cash, Visa, MC, Discover, & American Express",
          "willCallDetail": "Box Office will be open until curtain time on performance days, and will open at noon on Sundays where there is a scheduled performance. Customer must present the actual credit card used to place order and a photo ID"
        },
        "parkingDetail": "Official Centre parking is available for $6 at the venue parking deck and surface lot.",
        "accessibleSeatingDetail": "This is an accessible venue. Please contact box office at 770.916.2852",
        "generalInfo": {
          "generalRule": "No outside food or drink is permitted. No cameras or recording devices. Only trained service animals are permitted in the Centre.",
          "childRule": "All patrons must have a ticket, regardless of age. Children under four are not admitted except for specific family programs and all children must have a ticket. Please be aware that not all events are suitable for Children and plan accordingly. Children who are disruptive may be asked to leave the theatre."
        },
        "_links": {
          "self": {
            "href": "/discovery/v2/venues/KovZpa3j7e?locale=en-us"
          }
        }
      }],
      "attractions": [{
        "name": "Pokemon Symphonic Evolutions",
        "type": "attraction",
        "id": "K8vZ917KMdf",
        "test": false,
        "url": "http://ticketmaster.com/artist/2008305",
        "locale": "en-us",
        "images": [{
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RECOMENDATION_16_9.jpg",
          "width": 100,
          "height": 56,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_ARTIST_PAGE_3_2.jpg",
          "width": 305,
          "height": 203,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_LANDSCAPE_16_9.jpg",
          "width": 1136,
          "height": 639,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_16_9.jpg",
          "width": 1024,
          "height": 576,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_3_2.jpg",
          "width": 640,
          "height": 427,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_RETINA_PORTRAIT_16_9.jpg",
          "width": 640,
          "height": 360,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_EVENT_DETAIL_PAGE_16_9.jpg",
          "width": 205,
          "height": 115,
          "fallback": false
        }, {
          "ratio": "4_3",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_CUSTOM.jpg",
          "width": 305,
          "height": 225,
          "fallback": false
        }, {
          "ratio": "3_2",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_3_2.jpg",
          "width": 1024,
          "height": 683,
          "fallback": false
        }, {
          "ratio": "16_9",
          "url": "http://s1.ticketm.net/dam/a/bed/8bf2066d-e2b9-468e-bb3e-3870781f5bed_84001_TABLET_LANDSCAPE_LARGE_16_9.jpg",
          "width": 2048,
          "height": 1152,
          "fallback": false
        }],
        "classifications": [{
          "primary": true,
          "segment": {
            "id": "KZFzniwnSyZfZ7v7na",
            "name": "Arts & Theatre"
          },
          "genre": {
            "id": "KnvZfZ7v7nJ",
            "name": "Classical"
          },
          "subGenre": {
            "id": "KZazBEonSMnZfZ7v7nI",
            "name": "Symphonic"
          }
        }],
        "_links": {
          "self": {
            "href": "/discovery/v2/attractions/K8vZ917KMdf?locale=en-us"
          }
        }
      }]
    }
  },
  "checkin": "2016-11-18T00:00:00.000Z",
  "checkout": "2016-11-21T00:00:00.000Z"
};
//# sourceMappingURL=thing.controller.js.map
