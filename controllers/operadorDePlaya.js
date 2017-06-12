'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');


function getOperador(req, res){
	var operadorId = req.params.id;

	Persona.findById(operadorId, (err, operador) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!operador){
				res.status(404).send({message: 'El operador no existe'});
			}else{
				if(operador.rol.descripcion != "OperadorDePlaya"){
				res.status(404).send({message: 'El rol no es operador de playa'});
			}else{
					res.status(200).send({operador});
				}
			}
		}
	});
}

function getOperadores(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;


	Persona.find({'rol.descripcion': 'OperadorDePlaya'}).sort('rol.apellido').paginate(page, itemsPerPage, function(err,operadores,total){

		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!operadores){
				res.status(404).send({message:'No hay operadores de playa!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					operadores: operadores
				});
			}
		}
	});
}

function saveOperador(req, res){
	var persona = new Persona();

	var params = req.body;

	var rol = persona.rol;

	persona.nombreUsuario = params.nombreUsuario;
	persona.email = params.email;
	rol.descripcion = "OperadorDePlaya";
	rol.nombre = params.nombre;
	rol.apellido = params.apellido;
	rol.dni = params.dni;
	rol.cuadras = [{'calle': params.calle, 
					'alturaDesde' : params.alturaDesde,
					'alturaHasta': params.alturaHasta,
					'zona': params.zona}];

	
	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			persona.clave = hash;

			if(persona.nombreUsuario != null  && persona.email != null){
				// Guarda el operador
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el operador de playa'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado el operador de playa'});
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