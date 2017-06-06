'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonaSchema = Schema({
		nombre: String,
		apellido: String,
		dni: Number,
		saldo: Number,
		telefono: Number,
		usuario: {type: Schema.ObjectId, ref:'Usuario'},
		Cuadra: {type: Schema.ObjectId, ref:'Cuadra'},
		RazonSocial: String,
		NombreFantasia: String,
		Cuit: Number
});

module.exports = mongoose.model('Persona', PersonaSchema);