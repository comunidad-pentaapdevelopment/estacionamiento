'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonaSchema = Schema({
		Nombre: String,
		Apellido: String,
		Dni: Number,
		Rol: String,
		Usuario: String,
		Clave: String,
		Saldo: Number,
		Cuadra: {type: Schema.ObjectId, ref:'Cuadra'},
		RazonSocial: String,
		NombreFantasia: String,
		Cuit: Number
});

module.exports = mongoose.model('Persona', PersonaSchema);