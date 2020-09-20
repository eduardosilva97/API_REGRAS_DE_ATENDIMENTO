const express = require('express');
const server = express();
const regrasAtendimentoController = require('../../src/controller/regrasAtendimentoController.js');
const controller = new regrasAtendimentoController();

server.use(express.json());

module.exports = server;

server.post(`/cadastrar`, controller.cadastrar);
server.get(`/regras`, controller.listarRegras)
server.get(`/horarios`, controller.listarHorarios);
server.delete(`/excluir`, controller.excluir);

