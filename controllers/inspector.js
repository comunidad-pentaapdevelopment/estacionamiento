'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function getInspector(req, res){
	var inspectorId = req.params.id;
    
	Persona.findById(inspectorId, (err, inspector) =>{
		var usuarioId = inspector.usuario;

		Usuario.findById(usuarioId, (err, usuario) =>{
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(usuario.rol != 'Inspector'){
				res.status(404).send({message: 'El rol no es Inspector'});
			}else{
				if(!inspector){
				res.status(404).send({message: 'El Inspector no existe'});
				}else{
				res.status(200).send({inspector});
					}	
				}
			}
		});	
	});
}

function getInspectores(req, res){
	var usuarioId = req.params.Usuario;

	if (!usuarioId) {
		// sacar todos los conductores de la bd
		var find = Persona.find({}).sort('apellido'); // sort es para ordenar
	}else{
		// sacar los conductores de un usuario concreto de la bd
		var find = Persona.find({usuario: usuarioId}).sort('nombreUsuario');
	}

	find.populate({path: 'usuario'}).exec((err, inspectores) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!inspectores){
				res.status(404).send({message: 'No hay inspectores'});
			}else{
				res.status(200).send({inspectores});
			}
		}
	});
}

function saveInspector(req, res){
	// Este metodo guarda un usuario primero y luego el conductor con el objeto de usuario

	var usuario = new Usuario();

	var params = req.body;

	usuario.nombreUsuario = params.nombreUsuario;
	usuario.rol = "Inspector";
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


	persona.save((err, inspectorStored) => {
		if(err){
			res.status(500).send({message:'Error al guardar el inspector'});
		}else{
			if(!inspectorStored){
				res.status(404).send({message:'El inspector no ha sido guardado'});
			}else{
				res.status(200).send({persona: inspectorStored});
			}
		}
	});
}

function updateInspector(req, res){
	var inspectorId = req.params.id;
	var update = req.body;

	Persona.findByIdAndUpdate(inspectorId, update, (err, inspectorUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar el inspector'});
		}else{
			if(!inspectorUpdated)
			{
				res.status(404).send({message:'El inspector no ha sido actualizado'});
			}else{
				res.status(200).send({persona: inspectorUpdated});
			}
		}
	});
}

// Ver bien si vamos a usar o no este metodo

function deleteInspector(req, res){
	var inspectorId = req.params.id;

	Persona.findByIdAndRemove(inspectorId, (err, inspectorRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!municipalRemoved){
				res.status(404).send({message: 'No se ha borrado el inspector'});
			}else{
				res.status(200).send({persona: inspectorRemoved});
			}
		}
	});
}

module.exports = {
	saveInspector,
	updateInspector,
	deleteInspector,
	getInspector,
	getInspectores
};