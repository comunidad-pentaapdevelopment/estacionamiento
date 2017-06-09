'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var PuntoVenta = require('../models/puntoVenta');
var Usuario = require('../models/usuario');
var jwt = require('../services/jwt');

function getPuntoVenta(req, res){
	var puntoVentaId = req.params.id;
    
	PuntoVenta.findById(puntoVentaId, (err, puntoVenta) =>{
		var usuarioId = puntoVenta.usuario;

		Usuario.findById(usuarioId, (err, usuario) =>{
			if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(usuario.rol != 'PuntoVenta'){
				res.status(404).send({message: 'El rol no es punto de Venta'});
			}else{
				if(!puntoVenta){
				res.status(404).send({message: 'El punto de Venta no existe'});
				}else{
				res.status(200).send({puntoVenta});
					}	
				}
			}
		});	
	});
}

function getPuntosVenta(req, res){
	var usuarioId = req.params.Usuario;

	if (!usuarioId) {
		// sacar todos los conductores de la bd
		var find = PuntoVenta.find({}).sort('razonSocial'); // sort es para ordenar
	}else{
		// sacar los conductores de un usuario concreto de la bd
		var find = PuntoVenta.find({usuario: usuarioId}).sort('nombreUsuario');
	}

	find.populate({path: 'usuario'}).exec((err, puntosVenta) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!puntosVenta){
				res.status(404).send({message: 'No hay puntos de venta'});
			}else{
				res.status(200).send({puntosVenta});
			}
		}
	});
}

function savePuntoVenta(req, res){
	// Este metodo guarda un usuario primero y luego el punto de venta con el objeto de usuario

	var usuario = new Usuario();

	var params = req.body;

	usuario.nombreUsuario = params.nombreUsuario;
	usuario.rol = "PuntoVenta";
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

	var puntoVenta = new PuntoVenta();

	puntoVenta.razonSocial = params.razonSocial;
	puntoVenta.nombreFantasia = params.nombreFantasia;
	puntoVenta.cuit = params.cuit;
	puntoVenta.saldo = 0;
	puntoVenta.telefono = params.telefono;
	puntoVenta.usuario = usuario._id;


	puntoVenta.save((err, puntoVentaStored) => {
		if(err){
			res.status(500).send({message:'Error al guardar el punto de venta'});
		}else{
			if(!puntoVentaStored){
				res.status(404).send({message:'El punto de venta no ha sido guardado'});
			}else{
				res.status(200).send({puntoVenta: puntoVentaStored});
			}
		}
	});
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