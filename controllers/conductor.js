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
			if(!conductor){
				res.status(404).send({message: 'El conductor no existe'});
			}else{
				if(conductor.rol.descripcion != "Conductor"){
				res.status(404).send({message: 'El rol no es conductor'});
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


	Persona.find({'rol.descripcion': 'Conductor'}).sort('rol.apellido').paginate(page, itemsPerPage, function(err,conductores,total){

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

	var rol = persona.rol;

	persona.nombreUsuario = params.nombreUsuario;
	persona.email = params.email;
	rol.descripcion = "Conductor";
	rol.nombre = params.nombre;
	rol.apellido = params.apellido;
	rol.dni = params.dni;
	rol.saldo = 0;

	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			persona.clave = hash;

			if(persona.nombreUsuario != null  && persona.email != null){
				// Guarda el conductor
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el conductor'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado el conductor'});
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

// Ver bien si vamos a usar o no este metodo

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