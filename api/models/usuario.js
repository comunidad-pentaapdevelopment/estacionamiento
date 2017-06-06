'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
		nombreUsuario: String,
		clave: String,
		rol: String,
		email: String
});

module.exports = mongoose.model('Usuario', UsuarioSchema);