const express = require('express');
const router = express.Router();
const { processEpisodesData } = require('../controllers/processTvEpisodes');

const { asyncMiddleware } = require('../controllers/util/helperFunctions');


/* GET home page. */
router.post('/', asyncMiddleware(processEpisodesData));

module.exports = router;
