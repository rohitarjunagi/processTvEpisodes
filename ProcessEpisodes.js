var express = require('express');
var _ = require('lodash');
var util = require('util');
exports = module.exports = ProcessEpisodes;

//empty constructor
function ProcessEpisodes() {

}

/**
Function takes the episodes from the request and picks the required
data and sends it back to the client
*/
ProcessEpisodes.prototype.processEpisodesData = function() {
  return function(req, res, next) {
    var errorResponse = {};
    validateReqBody(req, function(err) {
      if (err) {
        errorResponse.error = "Could not decode request: JSON parsing failed";
        return res.status(400).send(errorResponse);
      }
      var responseData = {};
      var responseArray = [];
      var payload = req.body.payload;
      formatResponse(payload, responseArray, function(err) {
        if (err) {
          errorResponse.error = "Could not decode request: JSON parsing failed";
          return res.status(400).send(errorResponse);
        }
        responseData.response = responseArray;
        res.status(200).send(responseData);
      });

    });
  }
}

/**
Function formats the episode data response to be sent back to the client
This function is called recursively until all the elements in the 
payload array are processed.
*/
function formatResponse(payload, dataArray, cb) {
  var episode;
  if (payload.length === 0) {
    return cb(null);
  }
  episode = payload.shift();
  if (checkEligibility(episode)) {
    var data = {};
    if (episode.image) {
      data.image = episode.image.showImage;
    } else {
      data.image = '';
    }
    data.slug = episode.slug;
    data.title = episode.title;
    dataArray.push(data);
    formatResponse(payload, dataArray, cb);
  } else {
    formatResponse(payload, dataArray, cb);
  }
}

/**
Function does basic validation on the request body
to check if the request body is vali
This function is called recursively until all the elements in the 
payload array are processed.
*/

function validateReqBody(req, cb) {
  var contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    return cb(new Error());
  }
  //check if req body is empty
  if (_.isEmpty(req.body)) {
    return cb(new Error());
  }
  //check if payload exists
  if (!req.body.payload) {
    return cb(new Error());
  }
  //check if payload length is zero
  if (req.body.payload.length === 0) {
    return cb(new Error());
  }
  cb(null);
}

/**
Function checks if the episode is eligible to be sent in the response by
checking for the drm and episode coun
This function is called recursively until all the elements in the 
payload array are processed.
*/
function checkEligibility(episode) {
  if (!episode.hasOwnProperty('drm') || typeof(episode.drm) !== "boolean") {
    return false;
  }
  if (!episode.hasOwnProperty('episodeCount') || typeof episode.episodeCount !== "number") {
    return false;
  }
  if (episode.drm !== true || episode.episodeCount <= 0) {
    return false;
  }
  return true;
}

/**
Function registers /processEpisodes route with express and
returns a route
This function is called recursively until all the elements in the 
payload array are processed.
*/
ProcessEpisodes.prototype.setupRoutes = function() {
  var router = express.Router();
  router.post('/', this.processEpisodesData());
  return router;
}