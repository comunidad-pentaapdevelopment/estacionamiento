'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PuntoVentaSchema = Schema({
		razonSocial: String,
		nombreFantasia: String,
		cuit: Number,
		saldo: Number,
		telefono: Number,
		usuario: {type: Schema.ObjectId, ref:'Usuario'}
});

module.exports = mongoose.model('PuntoVenta', PuntoVentaSchema);