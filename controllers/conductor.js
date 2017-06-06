'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function getConductor(req, res){
	var conductorId = req.params.id;
    
	Persona.findById(conductorId, (err, conductor) =>{
		var usuarioId = conductor.usuario;

		Usuario.findById(usuarioId, (err, usuario) =>{
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(usuario.rol != 'Conductor'){
				res.status(404).send({message: 'El rol no es conductor'});
			}else{
				if(!conductor){
				res.status(404).send({message: 'El conductor no existe'});
				}else{
				res.status(200).send({conductor});
					}	
				}
			}
		});	
	});
}

function getConductores(req, res){
	var usuarioId = req.params.Usuario;

	if (!usuarioId) {
		// sacar todos los conductores de la bd
		var find = Persona.find({}).sort('Apellido'); // sort es para ordenar
	}else{
		// sacar los conductores de un usuario concreto de la bd
		var find = Persona.find({usuario: usuarioId}).sort('nombreUsuario');
	}

	find.populate({path: 'usuario'}).exec((err, conductores) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!conductores){
				res.status(404).send({message: 'No hay conductores'});
			}else{
				res.status(200).send({conductores});
			}
		}
	});
}

function saveConductor(req, res){
	// Este metodo guarda un usuario primero y luego el conductor con el objeto de usuario

	var usuario = new Usuario();

	var params = req.body;

	usuario.nombreUsuario = params.nombreUsuario;
	usuario.rol = "Conductor";
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
	persona.saldo = 0;
	persona.telefono = params.telefono;
	persona.usuario = usuario._id;


	persona.save((err, conductorStored) => {
		if(err){
			res.status(500).send({message:'Error al guardar el conductor'});
		}else{
			if(!conductorStored){
				res.status(404).send({message:'El conductor no ha sido guardado'});
			}else{
				res.status(200).send({persona: conductorStored});
			}
		}
	});
}

function updateConductor(req, res){
	var conductorId = req.params.id;
	var update = req.body;

	Persona.findByIdAndUpdate(conductorId, update, (err, conductorUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar el conductor'});
		}else{
			if(!conductorUpdated)
			{
				res.status(404).send({message:'El conductor no ha sido actualizado'});
			}else{
				res.status(200).send({persona: conductorUpdated});
			}
		}
	});
}

// Ver bien si vamos a usar o no este metodo

/*function deleteConductor(req, res){
	var conductorId = req.params.id;

	Persona.findByIdAndRemove(conductorId, (err, conductorRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!conductorRemoved){
				res.status(404).send({message: 'No se ha borrado el conductor'});
			}else{
				res.status(200).send({persona: conductorRemoved});
			}
		}
	});
}*/

module.exports = {
	saveConductor,
	updateConductor,
	//deleteConductor,
	getConductor,
	getConductores
};