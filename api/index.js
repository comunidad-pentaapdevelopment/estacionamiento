'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3978;

mongoose.connect('mongodb://localhost:27017/estacionamiento', (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("La conexion a la base de datos esta funcionando correctamente...");

		app.listen(port, function(){
			console.log("Servidor del api rest de estacionamiento escuchando en http://localhost:"+port);
		});
	}
});