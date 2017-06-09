'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require ('mongoose-Pagination');
var Cuadra = require('../models/cuadra');
var jwt = require('../services/jwt');

function getCuadra(req, res){
	var cuadraId = req.params.id;

	Cuadra.findById(cuadraId, (err, cuadra) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!cuadra){
				res.status(404).send({message: 'La cuadra no existe'});
			}else{
				res.status(200).send({cuadra});
			}	
		}
	});
}

function getCuadras(req, res){
	if(req.params.page){
		var page = req.params.page;
	}else{
		var page = 1;
	}
	var itemsPerPage = 4;

	Cuadra.find().sort('Calle').paginate(page, itemsPerPage, function(err,cuadras,total){
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!cuadras){
				res.status(404).send({message:'No hay cuadras!!'});
			}else{
				return res.status(200).send({
					total_items: total,
					cuadras: cuadras
					});
				}
			}	
	});
}

function saveCuadra(req, res){
	var cuadra = new Cuadra();

	var params = req.body;

	cuadra.calle = params.calle;
	cuadra.alturaDesde = params.alturaDesde;
	cuadra.alturaHasta = params.alturaHasta;
	cuadra.zona = params.zona;

	cuadra.save((err, cuadraStored) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!cuadraStored){
				res.status(404).send({message: 'No se ha guardado la cuadra'});
			}else{
				res.status(200).send({cuadra: cuadraStored});
			}
		}
	});
}

function updateCuadra(req, res){
	var cuadraId = req.params.id;
	var update = req.body;

	Cuadra.findByIdAndUpdate(cuadraId, update, (err, cuadraUpdated) =>{
		if(err){
			res.status(500).send({message:'Error al actualizar la cuadra'});
		}else{
			if(!cuadraUpdated)
			{
				res.status(404).send({message:'La cuadra no ha sido actualizado'});
			}else{
				res.status(200).send({cuadra: cuadraUpdated});
			}
		}
	});
}

function deleteCuadra(req, res){
	var cuadraId = req.params.id;

	Cuadra.findByIdAndRemove(cuadraId, (err, cuadraRemoved) =>{
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!cuadraRemoved){
				res.status(404).send({message: 'No se ha borrado el conductor'});
			}else{
				res.status(200).send({cuadra: cuadraRemoved});
			}
		}
	});
}

module.exports = {
	saveCuadra,
	updateCuadra,
	deleteCuadra,
	getCuadra,
	getCuadras
};