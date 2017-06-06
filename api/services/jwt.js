'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.createToken = function(usuario){
	var payload = {
		sub: usuario._id, // donde se guarda el id
		nombreUsuario: usuario.nombreUsuario,
		rol: usuario.rol,
		email: usuario.email,
		iat: moment().unix(), // fecha de creacion del token
		exp: moment().add(30,'days').unix  // fecha de expiracion del token cada 30 dias
	};

	return jwt.encode(payload, secret); // codifica el token con una clave secreta
};