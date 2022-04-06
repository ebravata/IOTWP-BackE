const { Router } = require('express');
const express = require('express');
const { getData, getTests, getStations, getModels, getTestsSearch } = require('../controllers/controller');
// const app = express();

const router = Router();

router.get('/calzeus/report/:ns/:start/:stop', getData);
router.get('/calzeus/tests', getTests);
router.get('/calzeus/search/:station/:model/:serial/:rstart/:rstop', getTestsSearch);

router.get('/calzeus/stations', getStations);
router.get('/calzeus/models', getModels);

module.exports= router