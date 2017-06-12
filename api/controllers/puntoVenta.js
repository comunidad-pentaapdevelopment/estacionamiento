'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Persona = require('../models/persona');
var jwt = require('../services/jwt');

function getPuntoVenta(req, res){
	var puntoVentaId = req.params.id;

	Persona.findById(puntoVentaId, (err, puntoVenta) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!puntoVenta){
				res.status(404).send({message: 'El punto de Venta no existe'});
			}else{
				if(puntoVenta.rol.descripcion != "PuntoVenta"){
				res.status(404).send({message: 'El rol no es punto de Venta'});
			}else{
					res.status(200).send({puntoVenta});
				}
			}
		}
	});
}

function getPuntosVenta(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;


	Persona.find({'rol.descripcion': 'PuntoVenta'}).sort('rol.nombreFantasia').paginate(page, itemsPerPage, function(err,puntoVentas,total){

		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!puntoVentas){
				res.status(404).send({message:'No hay punto de ventas!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					puntoVentas: puntoVentas
				});
			}
		}
	});
}

function savePuntoVenta(req, res){
	var persona = new Persona();

	var params = req.body;

	var rol = persona.rol;

	persona.nombreUsuario = params.nombreUsuario;
	persona.email = params.email;
	rol.descripcion = "PuntoVenta";
	rol.razonSocial = params.razonSocial;
	rol.nombreFantasia = params.nombreFantasia;
	rol.cuit = params.cuit;
	rol.saldo = 0;

	if(params.clave){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.clave,null,null,function(err,hash){
			persona.clave = hash;

			if(persona.nombreUsuario != null  && persona.email != null){
				// Guarda el punto de venta
				persona.save((err,personaStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el punto de venta'});
					}else{
						if(!personaStored){
							res.status(404).send({message: 'No se ha registrado el punto de venta'});
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

function updatePuntoVenta(req, res){
	var puntoVentaId = req.params.id;
	var update = req.body;

	PuntoVenta.findByIdAndUpdate(puntoVentaId, update, (err, puntoVentaUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar el punto de venta'});
		}else{
			if(!puntoVentaUpdated)
			{
				res.status(404).send({message:'El punto de venta no ha sido actualizado'});
			}else{
				res.status(200).send({puntoventa: puntoVentaUpdated});
			}
		}
	});
}


function deletePuntoVenta(req, res){
	var puntoVentaId = req.params.id;

	PuntoVenta.findByIdAndRemove(puntoVentaId, (err, puntoVentaRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!puntoVentaRemoved){
				res.status(404).send({message: 'No se ha borrado el punto de venta'});
			}else{
				res.status(200).send({puntoVenta: puntoVentaRemoved});
			}
		}
	});
}

module.exports = {
	savePuntoVenta,
	updatePuntoVenta,
	deletePuntoVenta,
	getPuntoVenta,
	getPuntosVenta
};