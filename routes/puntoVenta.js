'use strict'

var express = require('express');
var PuntoVentaController = require('../controllers/puntoVenta');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

// Punto de ventas
api.get('/traerPuntoVenta/:id', md_auth.ensureAuth, PuntoVentaController.getPuntoVenta);
api.get('/traerPuntosVenta/:page?', md_auth.ensureAuth, PuntoVentaController.getPuntosVenta);
api.post('/registrarPuntoVenta', md_auth.ensureAuth, PuntoVentaController.savePuntoVenta);
api.put('/modificarPuntoVenta/:id', md_auth.ensureAuth, PuntoVentaController.updatePuntoVenta);
api.delete('/eliminarPuntoVenta/:id', md_auth.ensureAuth, PuntoVentaController.deletePuntoVenta);

module.exports = api;