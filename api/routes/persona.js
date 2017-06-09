'use strict'

var express = require('express');

var ConductorController = require('../controllers/conductor');
var OperadorController = require('../controllers/operadorDePlaya');
var MunicipalController = require('../controllers/municipal');
var AdminController = require('../controllers/admin');
var InspectorController = require('../controllers/inspector');



var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

// Conductores
api.get('/traerConductor/:id', md_auth.ensureAuth, ConductorController.getConductor);
api.get('/traerConductores/:page?', md_auth.ensureAuth, ConductorController.getConductores);
api.post('/registrarConductor', md_auth.ensureAuth, ConductorController.saveConductor);
api.put('/modificarConductor/:id', md_auth.ensureAuth, ConductorController.updateConductor);
//api.delete('/eliminarConductor/:id', md_auth.ensureAuth, ConductorController.deleteConductor);

// Operadores de Playa
api.get('/traerOperador/:id', md_auth.ensureAuth, OperadorController.getOperador);
api.get('/traerOperadores/:page?', md_auth.ensureAuth, OperadorController.getOperadores);
api.post('/registrarOperador', md_auth.ensureAuth, OperadorController.saveOperador);
api.put('/modificarOperador/:id', md_auth.ensureAuth, OperadorController.updateOperador);
api.delete('/eliminarOperador/:id', md_auth.ensureAuth, OperadorController.deleteOperador);

// Municipales
api.get('/traerMunicipal/:id', md_auth.ensureAuth, MunicipalController.getMunicipal);
api.get('/traerMunicipales/:page?', md_auth.ensureAuth, MunicipalController.getMunicipales);
api.post('/registrarMunicipal', md_auth.ensureAuth, MunicipalController.saveMunicipal);
api.put('/modificarMunicipal/:id', md_auth.ensureAuth, MunicipalController.updateMunicipal);
api.delete('/eliminarMunicipal/:id', md_auth.ensureAuth, MunicipalController.deleteMunicipal);

// Admins
api.get('/traerAdmin/:id', md_auth.ensureAuth, AdminController.getAdmin);
api.get('/traerAdmins/:page?', md_auth.ensureAuth, AdminController.getAdmins);
api.post('/registrarAdmin', md_auth.ensureAuth, AdminController.saveAdmin);
api.put('/modificarAdmin/:id', md_auth.ensureAuth, AdminController.updateAdmin);
api.delete('/eliminarAdmin/:id', md_auth.ensureAuth, AdminController.deleteAdmin);

// Inspectores

api.get('/traerInspector/:id', md_auth.ensureAuth, InspectorController.getInspector);
api.get('/traerInspectores/:page?', md_auth.ensureAuth, InspectorController.getInspectores);
api.post('/registrarInspector', md_auth.ensureAuth, InspectorController.saveInspector);
api.put('/modificarInspector/:id', md_auth.ensureAuth, InspectorController.updateInspector);
api.delete('/eliminarInspector/:id', md_auth.ensureAuth, InspectorController.deleteInspector);

module.exports = api;