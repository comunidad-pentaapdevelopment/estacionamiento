'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');
var Cuadra = require('../models/cuadra');


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


module.exports = {
	saveConductor,
	updateConductor
};