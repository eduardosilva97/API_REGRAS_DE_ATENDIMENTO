const service = require("../services/regrasAtendimentoService")

class regrasAtendimentoController {

    constructor() {
      this.service = new service();
      this.cadastrar = this.cadastrar.bind(this);
      this.listarRegras = this.listarRegras.bind(this);
      this.listarHorarios = this.listarHorarios.bind(this);
      this.excluir = this.excluir.bind(this);
    }
  
    cadastrar(req, res) {
        let resposta = this.service.cadastrar(req.body);
        return res.status(resposta.statusCode).send(resposta);
    }
  
    listarRegras(req, res) {
        return res.status(200).send(this.service.listarRegras());
    }
  
    listarHorarios(req, res) {
        const { dataInicio, dataFim } = req.query;

        let resposta =  this.service.listarHorarios(dataInicio, dataFim);

        return res.status(resposta.statusCode).send(resposta);
    }
  
    excluir(req, res) {
        const { id, type } = req.query;

        let resposta =  this.service.excluir(parseInt(id), type);

        return res.status(resposta.statusCode).send(resposta);
    }
  
}
  
module.exports = regrasAtendimentoController;