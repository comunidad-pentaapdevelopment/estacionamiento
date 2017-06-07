'use strict'

var express = require('express');
var PuntoVentaController = require('../controllers/puntoVenta');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

// Punto de ventas
api.get('/traerPuntoVenta/:id',  PuntoVentaController.getPuntoVenta);
api.get('/traerPuntosVenta/:page?', PuntoVentaController.getPuntosVenta);
api.post('/registrarPuntoVenta', PuntoVentaController.savePuntoVenta);
api.put('/modificarPuntoVenta/:id', PuntoVentaController.updatePuntoVenta);
api.delete('/eliminarPuntoVenta/:id', PuntoVentaController.deletePuntoVenta);

module.exports = api;