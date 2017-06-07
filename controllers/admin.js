'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function getAdmin(req, res){
	var adminId = req.params.id;
    
	Persona.findById(adminId, (err, admin) =>{
		var usuarioId = admin.usuario;

		Usuario.findById(usuarioId, (err, usuario) =>{
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(usuario.rol != 'Admin'){
				res.status(404).send({message: 'El rol no es admin'});
			}else{
				if(!admin){
				res.status(404).send({message: 'El admin no existe'});
				}else{
				res.status(200).send({admin});
					}	
				}
			}
		});	
	});
}

function getAdmins(req, res){
	var usuarioId = req.params.Usuario;

	if (!usuarioId) {
		// sacar todos los admins de la bd
		var find = Persona.find({}).sort('apellido'); // sort es para ordenar
	}else{
		// sacar los admins de un usuario concreto de la bd
		var find = Persona.find({usuario: usuarioId}).sort('nombreUsuario');
	}

	find.populate({path: 'usuario'}).exec((err, admins) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!admins){
				res.status(404).send({message: 'No hay admins'});
			}else{
				res.status(200).send({admins});
			}
		}
	});
}

function saveAdmin(req, res){
	// Este metodo guarda un usuario primero y luego el admin con el objeto de usuario

	var usuario = new Usuario();

	var params = req.body;

	usuario.nombreUsuario = params.nombreUsuario;
	usuario.rol = "Admin";
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


	persona.save((err, adminStored) => {
		if(err){
			res.status(500).send({message:'Error al guardar el admin'});
		}else{
			if(!adminStored){
				res.status(404).send({message:'El admin no ha sido guardado'});
			}else{
				res.status(200).send({persona: adminStored});
			}
		}
	});
}

function updateAdmin(req, res){
	var adminId = req.params.id;
	var update = req.body;

	Persona.findByIdAndUpdate(adminId, update, (err, adminUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar el admin'});
		}else{
			if(!adminUpdated)
			{
				res.status(404).send({message:'El admin no ha sido actualizado'});
			}else{
				res.status(200).send({persona: adminUpdated});
			}
		}
	});
}

// Ver bien si vamos a usar o no este metodo

function deleteAdmin(req, res){
	var adminId = req.params.id;

	Persona.findByIdAndRemove(adminId, (err, adminRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!adminRemoved){
				res.status(404).send({message: 'No se ha borrado el admin'});
			}else{
				res.status(200).send({persona: adminRemoved});
			}
		}
	});
}

module.exports = {
	saveAdmin,
	updateAdmin,
	deleteAdmin,
	getAdmin,
	getAdmins
};