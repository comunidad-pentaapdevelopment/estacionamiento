'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');

function getAdmin(req, res){
	var adminId = req.params.id;

	Persona.findById(adminId, (err, admin) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!admin){
				res.status(404).send({message: 'El admin no existe'});
			}else{
				if(admin.rol.descripcion != "Admin"){
				res.status(404).send({message: 'El rol no es admin'});
			}else{
					res.status(200).send({admin});
				}
			}
		}
	});
}

function getAdmins(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;


	Persona.find({'rol.descripcion': 'Admin'}).sort('rol.apellido').paginate(page, itemsPerPage, function(err,admins,total){

		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!admins){
				res.status(404).send({message:'No hay admins!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					admins: admins
				});
			}
		}
	});
}

function saveAdmin(req, res){
	var persona = new Persona();

	var params = req.body;

	var rol = persona.rol;

	persona.nombreUsuario = params.nombreUsuario;
	persona.email = params.email;
	rol.descripcion = "Admin";
	rol.nombre = params.nombre;
	rol.apellido = params.apellido;
	rol.dni = params.dni;

	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			persona.clave = hash;

			if(persona.nombreUsuario != null  && persona.email != null){
				// Guarda el admin
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el admin'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado el admin'});
						}else
						  {
							res.status(200).send({persona: personaStored});
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