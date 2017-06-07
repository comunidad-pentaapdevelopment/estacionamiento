'use strict'

var express = require('express');

var ConductorController = require('../controllers/conductor');
var OperadorController = require('../controllers/operadorDePlaya');
var MunicipalController = require('../controllers/municipal');


var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

// Conductores
api.get('/traerConductor/:id',  ConductorController.getConductor);
api.get('/traerConductores/:page?', ConductorController.getConductores);
api.post('/registrarConductor', ConductorController.saveConductor);
api.put('/modificarConductor/:id', ConductorController.updateConductor);
//api.delete('/eliminarConductor/:id', ConductorController.deleteConductor);

// Operadores de Playa
api.get('/traerOperador/:id',  OperadorController.getOperador);
api.get('/traerOperadores/:page?', OperadorController.getOperadores);
api.post('/registrarOperador', OperadorController.saveOperador);
api.put('/modificarOperador/:id', OperadorController.updateOperador);
api.delete('/eliminarOperador/:id', OperadorController.deleteOperador);

// Municipales

api.get('/traerMunicipal/:id',  MunicipalController.getMunicipal);
api.get('/traerMunicipales/:page?', MunicipalController.getMunicipales);
api.post('/registrarMunicipal', MunicipalController.saveMunicipal);
api.put('/modificarMunicipal/:id', MunicipalController.updateMunicipal);
api.delete('/eliminarMunicipal/:id', MunicipalController.deleteMunicipal);



module.exports = api;