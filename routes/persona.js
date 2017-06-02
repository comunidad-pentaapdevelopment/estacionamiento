'use strict'

var express = require('express');
var ConductorController = require('../controllers/conductor');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/registrarConductor', ConductorController.saveConductor);
api.put('/modificarConductor/:id', ConductorController.updateConductor);

module.exports = api;