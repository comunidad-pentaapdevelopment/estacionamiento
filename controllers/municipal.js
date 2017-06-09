'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function getMunicipal(req, res){
	var municipalId = req.params.id;
    
	Persona.findById(municipalId, (err, municipal) =>{
		var usuarioId = municipal.usuario;

		Usuario.findById(usuarioId, (err, usuario) =>{
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(usuario.rol != 'Municipal'){
				res.status(404).send({message: 'El rol no es municipal'});
			}else{
				if(!municipal){
				res.status(404).send({message: 'El municipal no existe'});
				}else{
				res.status(200).send({municipal});
					}	
				}
			}
		});	
	});
}

function getMunicipales(req, res){
	var usuarioId = req.params.Usuario;

	if (!usuarioId) {
		// sacar todos los municipales de la bd
		var find = Persona.find({}).sort('apellido'); // sort es para ordenar
	}else{
		// sacar los municipales de un usuario concreto de la bd
		var find = Persona.find({usuario: usuarioId}).sort('nombreUsuario');
	}

	find.populate({path: 'usuario'}).exec((err, municipales) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!municipales){
				res.status(404).send({message: 'No hay municipales'});
			}else{
				res.status(200).send({municipales});
			}
		}
	});
}

function saveMunicipal(req, res){
	// Este metodo guarda un usuario primero y luego el conductor con el objeto de usuario

	var usuario = new Usuario();

	var params = req.body;

	usuario.nombreUsuario = params.nombreUsuario;
	usuario.rol = "Municipal";
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


	persona.save((err, municipalStored) => {
		if(err){
			res.status(500).send({message:'Error al guardar el municipal'});
		}else{
			if(!municipalStored){
				res.status(404).send({message:'El municipal no ha sido guardado'});
			}else{
				res.status(200).send({persona: municipalStored});
			}
		}
	});
}

function updateMunicipal(req, res){
	var municipalId = req.params.id;
	var update = req.body;

	Persona.findByIdAndUpdate(municipalId, update, (err, municipalUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar el municipal'});
		}else{
			if(!municipalUpdated)
			{
				res.status(404).send({message:'El municipal no ha sido actualizado'});
			}else{
				res.status(200).send({persona: municipalUpdated});
			}
		}
	});
}

// Ver bien si vamos a usar o no este metodo

function deleteMunicipal(req, res){
	var municipalId = req.params.id;

	Persona.findByIdAndRemove(municipalId, (err, municipalRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!municipalRemoved){
				res.status(404).send({message: 'No se ha borrado el municipal'});
			}else{
				res.status(200).send({persona: municipalRemoved});
			}
		}
	});
}

module.exports = {
	saveMunicipal,
	updateMunicipal,
	deleteMunicipal,
	getMunicipal,
	getMunicipales
};