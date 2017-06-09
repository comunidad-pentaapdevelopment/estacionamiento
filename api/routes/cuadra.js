'use strict'

var express = require('express');
var CuadraController = require('../controllers/cuadra');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

// Cuadras
api.get('/traerCuadra/:id', md_auth.ensureAuth, CuadraController.getCuadra);
api.get('/traerCuadras/:page?', md_auth.ensureAuth, CuadraController.getCuadras);
api.post('/registrarCuadra', md_auth.ensureAuth, CuadraController.saveCuadra);
api.put('/modificarCuadra/:id', md_auth.ensureAuth, CuadraController.updateCuadra);
api.delete('/eliminarCuadra/:id', md_auth.ensureAuth, CuadraController.deleteCuadra);

module.exports = api;