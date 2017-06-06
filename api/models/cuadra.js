'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CuadraSchema = Schema({
		Calle: String,
		AlturaDesde: Number,
		AlturaHasta: Number
});

module.exports = mongoose.model('Cuadra', CuadraSchema);