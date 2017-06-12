'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');



function loginUsuario(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.clave;

	Persona.findOne({email: email}, (err,usuario) => {
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!usuario){
				res.status(404).send({message:'El usuario no existe'});
			}else{

				// Comprobar contraseña
				bcrypt.compare(password,usuario.clave, function(err,check){
					if(check){
						// Devolver los datos del usuario logueado
						if(params.gethash){
							// Devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(usuario)
							})
						}else{
							res.status(200).send({usuario});
						}
					}else{
						res.status(404).send({message:'El usuario no ha podido loguearse'});
					}
				});
			}
		}

	})
}

function updateUsuario(req,res){  // metodo para actualizar un usuario
	var usuarioId = req.params.id;
	var update = req.body;

	if(usuarioId != req.user.sub){
	  return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
	}

	Persona.findByIdAndUpdate(usuarioId, update, (err,usuarioUpdated) => {
		if(err){
			res.status(500).send({message:'Error al actualizar el usuario'});
		}else{
			if(!usuarioUpdated){
				res.status(404).send({message:'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({persona: usuarioUpdated});
			}
		}
	});
}


module.exports = {
	loginUsuario,
	updateUsuario
};