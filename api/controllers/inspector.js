'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');

function getInspector(req, res){
	var inspectorId = req.params.id;

	Persona.findById(inspectorId, (err, inspector) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!inspector){
				res.status(404).send({message: 'El inspector no existe'});
			}else{
				if(inspector.rol.descripcion != "Inspector"){
				res.status(404).send({message: 'El rol no es inspector'});
			}else{
					res.status(200).send({inspector});
				}
			}
		}
	});
}

function getInspectores(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;


	Persona.find({'rol.descripcion': 'Inspector'}).sort('rol.apellido').paginate(page, itemsPerPage, function(err,inspectores,total){
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!inspectores){
				res.status(404).send({message:'No hay inspectores!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					inspectores: inspectores
				});
			}
		}
	});
}

function saveInspector(req, res){
	var persona = new Persona();

	var params = req.body;

	var rol = persona.rol;

	persona.nombreUsuario = params.nombreUsuario;
	persona.email = params.email;
	rol.descripcion = "Inspector";
	rol.nombre = params.nombre;
	rol.apellido = params.apellido;
	rol.dni = params.dni;

	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			persona.clave = hash;

			if(persona.nombreUsuario != null  && persona.email != null){
				// Guarda el inspector
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el inspector'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado el inspector'});
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