'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');
var Cuadra = require('../models/cuadra');

function getOperador(req, res){
	var operadorId = req.params.id;
    
	Persona.findById(operadorId, (err, operador) =>{
		var usuarioId = operador.usuario;

		Usuario.findById(usuarioId, (err, usuario) =>{
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(usuario.rol != 'OperadorDePlaya'){
				res.status(404).send({message: 'El rol no es operador'});
			}else{
				if(!operador){
				res.status(404).send({message: 'El operador no existe'});
				}else{
				res.status(200).send({operador});
					}	
				}
			}
		});	
	});
}

function getOperadores(req, res){
	var cuadraId = req.params.Cuadra;

	if (!cuadraId) {
		// sacar todos los trapitos de la bd
		var find = Persona.find({}).sort('Apellido'); // sort es para ordenar
	}else{
		// sacar los trapitos de una calle concreta de la bd
		var find = Persona.find({cuadra: cuadraId}).sort('Calle');
	}

	find.populate({path: 'Cuadra'}).exec((err, operadores) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!operadores){
				res.status(404).send({message: 'No hay Operadores De Playa'});
			}else{
				res.status(200).send({operadores});
			}
		}
	});
}

function saveOperador(req, res){
	// Este metodo guarda un usuario primero y luego el operador con el objeto de usuario

	var usuario = new Usuario();

	var params = req.body;

	usuario.nombreUsuario = params.nombreUsuario;
	usuario.rol = "OperadorDePlaya";
	usuario.email = params.email;

	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			usuario.clave = hash;

			if(usuario.nombreUsuario != null  && usuario.email != null){
				// Guarda el usuario
				usuario.save((err,usuarioStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!usuarioStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else
						  {
							res.status(200).send({usuario: usuarioStored});
						  }
					}
				});

			}else{
				res.status(200).send({message: 'Rellene todos los cambios'});
			}
		});

	}else{
		res.status(500).send({message: 'Introduce la contraseña'});
	}

	var persona = new Persona();

	persona.nombre = params.nombre;
	persona.apellido = params.apellido;
	persona.dni = params.dni;
	persona.telefono = params.telefono;
	persona.usuario = usuario._id;
	

	persona.save((err, operadorStored) => {

		console.log(operadorStored.cuadra);
		if(err){
			res.status(500).send({message:'Error al guardar el operador'});
		}else{
			if(!operadorStored){
				res.status(404).send({message:'El operador no ha sido guardado'});
			}else{
				res.status(200).send({persona: operadorStored});
			}
		}
	});

}

function updateOperador(req, res){
	var operadorId = req.params.id;
	var update = req.body;

	Persona.findByIdAndUpdate(operadorId, update, (err, operadorUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar el Operador De Playa'});
		}else{
			if(!operadorUpdated)
			{
				res.status(404).send({message:'El Operador De Playa no ha sido actualizado'});
			}else{
				res.status(200).send({persona: operadorUpdated});
			}
		}
	});
}

function deleteOperador(req, res){
	var operadorId = req.params.id;

	Persona.findByIdAndRemove(operadorId, (err, operadorRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!operadorRemoved){
				res.status(404).send({message: 'No se ha borrado el Operador De Playa'});
			}else{
				res.status(200).send({persona: operadorRemoved});
			}
		}
	});
}

module.exports = {
	saveOperador,
	updateOperador,
	deleteOperador,
	getOperador,
	getOperadores
};