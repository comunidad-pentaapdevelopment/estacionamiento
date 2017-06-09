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
		cuadra: {type: Schema.ObjectId, ref:'Cuadra'}
});

module.exports = mongoose.model('Persona', PersonaSchema);