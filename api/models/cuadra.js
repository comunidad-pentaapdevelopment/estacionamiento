'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuadraSchema = Schema({
		calle: String,
		alturaDesde: Number,
		alturaHasta: Number,
		zona: String
});

module.exports = mongoose.model('Cuadra', CuadraSchema);