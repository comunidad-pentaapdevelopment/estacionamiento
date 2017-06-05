'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');

function getConductor(req, res){
	var conductorId = req.params.id;

	Persona.findById(conductorId, (err, conductor) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(conductor.Rol != 'Conductor'){
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
}

function getConductores(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Persona.find().sort('Apellido').paginate(page, itemsPerPage, function(err,conductores,total){
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!conductores){
				res.status(404).send({message:'No hay conductores!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					conductores: conductores
					});
				}
			}	
	});
}

function saveConductor(req, res){
	var persona = new Persona();

	var params = req.body;

	persona.Nombre = params.Nombre;
	persona.Apellido = params.Apellido;
	persona.Dni = params.Dni;
	persona.Rol = 'Conductor';
	persona.Usuario = params.Usuario;
	persona.Saldo = 0;

	if(params.Clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.Clave,null,null,function(err,hash){
			persona.Clave = hash;

			if(persona.Nombre != null && persona.Apellido != null && persona.Dni != null && persona.Usuario != null){
				// Guarda la persona
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar la persona'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado la persona'});
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

function deleteConductor(req, res){
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
}

module.exports = {
	saveConductor,
	updateConductor,
	deleteConductor,
	getConductor,
	getConductores
};