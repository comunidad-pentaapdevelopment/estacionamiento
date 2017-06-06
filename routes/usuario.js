'use strict'

var express = require('express');
var UsuarioController = require('../controllers/usuario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

api.post('/login', UsuarioController.loginUsuario);
api.put('/modificarUsuario/:id', md_auth.ensureAuth, UsuarioController.updateUsuario);

module.exports = api;