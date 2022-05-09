const { Router } = require('express');
const express = require('express');
const { getData, getTests, getStations, getModels, getTestsSearch } = require('../controllers/controller');
// const app = express();

const router = Router();

router.get('/calzeus/report/:ns/:station/:model/:id/:rstart/:rstop', getData);
router.get('/calzeus/tests/:rstart/:rstop', getTests);
router.get('/calzeus/search/:station/:model/:serial/:rstart/:rstop', getTestsSearch);

router.get('/calzeus/stations', getStations);
router.get('/calzeus/models', getModels);

module.exports= router