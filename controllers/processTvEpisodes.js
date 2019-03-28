const _ = require('lodash');
/**
Function takes the episodes from the request and picks the required
data and sends it back to the client
*/
exports.processEpisodesData = function (req, res, next) {
  const errorResponse = {};
  try {
    validateReqBody(req);
  } catch (err) {
    errorResponse.error = "Could not decode request: JSON parsing failed";
    res.header("Content-Type", "application/json");
    return res.status(400).send(errorResponse);
  }
  const responseData = {};
  const responseArray = [];
  const payload = req.body.payload;
  try {
    formatResponse(payload, responseArray);
  } catch (err) {
    errorResponse.error = "Could not decode request: JSON parsing failed";
    res.header("Content-Type", "application/json");
    return res.status(400).send(errorResponse);
  }
  responseData.response = responseArray;
  res.header("Content-Type", "application/json");
  res.status(200).send(responseData);
}

/**
Function formats the episode data response to be sent back to the client
This function is called recursively until all the elements in the 
payload array are processed.
*/
const formatResponse = (payload, dataArray) => {
  let episode = null;
  if (payload.length === 0) {
    return;
  }
  episode = payload.shift();
  if (checkEligibility(episode)) {
    const data = {};
    if (episode.image) {
      data.image = episode.image.showImage;
    } else {
      data.image = '';
    }
    data.slug = episode.slug;
    data.title = episode.title;
    dataArray.push(data);
    formatResponse(payload, dataArray);
  } else {
    formatResponse(payload, dataArray);
  }
}

/**
Function does basic validation on the request body
to check if the request body is vali
This function is called recursively until all the elements in the 
payload array are processed.
*/

function validateReqBody(req) {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    throw new Error('Invalid content-type');
  }
  //check if req body is empty
  if (_.isEmpty(req.body)) {
    throw new Error('Rquest Body is Empty')
  }
  //check if payload exists
  if (!req.body.payload) {
    throw new Error('Payload field is missing');
  }
  //check if payload length is zero
  if (req.body.payload.length === 0) {
    throw new Error('Payload length is 0');
  }
  return;
}

/**
Function checks if the episode is eligible to be sent in the response by
checking for the drm and episode coun
This function is called recursively until all the elements in the 
payload array are processed.
*/
function checkEligibility(episode) {
  if (!episode.hasOwnProperty('drm') || typeof (episode.drm) !== "boolean") {
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