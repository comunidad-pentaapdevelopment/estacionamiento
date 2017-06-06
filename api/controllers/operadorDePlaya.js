'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');
var Cuadra = require('../models/cuadra');

function getOperador(req, res){
	var operadorId = req.params.id;

	Persona.findById(operadorId, (err, operador) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(operador.Rol != 'OperadorDePlaya'){
				res.status(404).send({message: 'El rol no es OperadorDePlaya'});
			}else{
				if(!operador){
				res.status(404).send({message: 'El Operador De Playa no existe'});
				}else{
				res.status(200).send({operador});
				}	
			}
		}
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
	var persona = new Persona();

	var params = req.body;

	persona.Nombre = params.Nombre;
	persona.Apellido = params.Apellido;
	persona.Dni = params.Dni;
	persona.Rol = 'OperadorDePlaya';
	persona.Usuario = params.Usuario;
	persona.Cuadra = params.Cuadra;

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