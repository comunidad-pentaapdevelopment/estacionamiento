'use strict'

var express = require('express');
var CuadraController = require('../controllers/cuadra');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

// Cuadras
api.get('/traerCuadra/:id',  CuadraController.getCuadra);
api.get('/traerCuadras/:page?', CuadraController.getCuadras);
api.post('/registrarCuadra', CuadraController.saveCuadra);
api.put('/modificarCuadra/:id', CuadraController.updateCuadra);
api.delete('/eliminarCuadra/:id', CuadraController.deleteCuadra);

module.exports = api;