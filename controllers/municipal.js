'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');

function getMunicipal(req, res){
	var municipalId = req.params.id;

	Persona.findById(municipalId, (err, municipal) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!municipal){
				res.status(404).send({message: 'El municipal no existe'});
			}else{
				if(municipal.rol.descripcion != "Municipal"){
				res.status(404).send({message: 'El rol no es municipal'});
			}else{
					res.status(200).send({municipal});
				}
			}
		}
	});
}

function getMunicipales(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;


	Persona.find({'rol.descripcion': 'Municipal'}).sort('rol.apellido').paginate(page, itemsPerPage, function(err,municipales,total){
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!municipales){
				res.status(404).send({message:'No hay municipales!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					municipales: municipales
				});
			}
		}
	});
}

function saveMunicipal(req, res){
	var persona = new Persona();

	var params = req.body;

	var rol = persona.rol;

	persona.nombreUsuario = params.nombreUsuario;
	persona.email = params.email;
	rol.descripcion = "Municipal";
	rol.nombre = params.nombre;
	rol.apellido = params.apellido;
	rol.dni = params.dni;

	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			persona.clave = hash;

			if(persona.nombreUsuario != null  && persona.email != null){
				// Guarda el municipal
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el municipal'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado el municipal'});
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