let data = require('../../config/data/data.json');
const regraDiariaModel = require('../models/regraDiariaModel')
const regraSemanalModel = require('../models/regraSemanalModel')
const regraEspecificaModel = require('../models/regraEspecificaModel')
const horarioModel = require('../models/horarioModel')
const responseModel = require('../models/responseModel')
const fs = require('fs');
const { start } = require('repl');

class regrasAtendimentoService {
    constructor() {
        this.cadastrar = this.cadastrar.bind(this);
        this.listarRegras = this.listarRegras.bind(this);
        this.listarHorarios = this.listarHorarios.bind(this);
        this.excluir = this.excluir.bind(this);
    }
  
    //Função de cadastro de regras
    cadastrar(obj) {
        let objetoVazio = true;

        try{
            // Verifico tipo de objeto através da propriedade passada na requisição e envio o mesmo para função 
            // prepara objeto para que seja tratado antes da inserção
            if(obj.hasOwnProperty('specific')){ 
                objetoVazio = false;
                if(Array.isArray(obj.specific)){
                    for (var i = 0; i < obj.specific.length; i++)
                        data.specific.push(this.preparaObjeto(obj.specific[i], 's'));                       
                } else {
                    data.specific.push(this.preparaObjeto(obj.specific, 's'));
                }
            } 
        
            if(obj.hasOwnProperty('daily')){
                objetoVazio = false;
                if(Array.isArray(obj.daily)){
                    for (var i = 0; i < obj.daily.length; i++)
                    data.daily.push(this.preparaObjeto(obj.daily[i], 'd'));                       
                } else {
                    data.daily.push(this.preparaObjeto(obj.daily, 'd'));
                }
            }
        
            if(obj.hasOwnProperty('weekly')){       
                objetoVazio = false;     
                if(Array.isArray(obj.weekly)){
                    for (var i = 0; i < obj.weekly.length; i++)
                    data.weekly.push(this.preparaObjeto(obj.weekly[i], 'w'));                       
                } else {
                    data.weekly.push(this.preparaObjeto(obj.weekly, 'w'));
                }    
            }

            // Caso todos os objetos estejam vazios retorno um erro ao usuário
            if(objetoVazio)
                throw "Objeto inválido, verifique";

            this.atualizaJson();
        
            return new responseModel.rulesMessageResponse(false, 200, 'Regra cadastrada com sucesso!', data)
        } catch (e){
            return new responseModel.messageResponse(true, 422, e);
        }
        
    }
    
    //Função de listagem de regras
    listarRegras() {
        return  new responseModel.rulesResponse(false, 200, data);
    }
    
     //Função de exclusão de regras
     excluir(id, type) {
        try {
            //Valido o tipo da regra em seguida envio o seu id e a lista para que a regra seja excluida.
            switch(type){    
                case 's':            
                    data.specific = this.removeValor(data.specific, id)
                    break;
                case 'd':
                    data.daily = this.removeValor(data.daily, id)
                    break;
                case 'w':
                    data.weekly = this.removeValor(data.weekly, id)
                    break;
                default:  return new responseModel.messageResponse(false, 400, 'Tipo inválido, verifique!')
            }
            
            this.atualizaJson();
        
            return new responseModel.messageResponse(false, 200, 'Regra excluída com sucesso!')
        } catch (e) {
            return new responseModel.messageResponse(false, 404, e)
        }
        
    }

    //Função de listagem dos horários
    listarHorarios(dataInicio, dataFim) {
        const diaInicio = dataInicio.substring(0,dataInicio.indexOf('-'));
        const mesInicio = dataInicio.substring(dataInicio.indexOf('-')+1, dataInicio.lastIndexOf('-'));
        const anoInicio = dataInicio.substring(dataInicio.lastIndexOf('-')+1, dataInicio.length);

        let datas = this.ordenarDatas(this.obtemDatas(new Date(anoInicio, mesInicio-1, diaInicio), dataFim, true));


        return new responseModel.availableTimesResponse(false, 200, datas);
    }

    //Função de ordenação de lista pela data
    ordenarDatas(lista){
        lista = lista.sort((a, b) => {
            const diaA = a.day.substring(0,a.day.indexOf('-'));
            const mesA = a.day.substring(a.day.indexOf('-')+1, a.day.lastIndexOf('-'));
            const anoA = a.day.substring(a.day.lastIndexOf('-')+1, a.day.length);
            const diaB = b.day.substring(0,b.day.indexOf('-'));
            const mesB = b.day.substring(b.day.indexOf('-')+1, b.day.lastIndexOf('-'));
            const anoB = b.day.substring(b.day.lastIndexOf('-')+1, b.day.length);
            
            return new Date (anoA, mesA-1, diaA) - new Date(anoB, mesB-1, diaB)            
        });

        return lista;
    }

    // ----- Funções utilizadas no cadastro de regra  ----- //

    //Prepara os objetos para inserção no arquivo json
    preparaObjeto(obj, tipo){   
        let id = 1     
        switch(tipo){
            case 's':  
                if(!this.possuiValoresObrigatorios(obj, 's'))
                    throw "Objeto inválido, verifique"

                const diaInicio = obj.day.substring(0,obj.day.indexOf('-'));
                const mesInicio = obj.day.substring(obj.day.indexOf('-')+1, obj.day.lastIndexOf('-'));
                const anoInicio = obj.day.substring(obj.day.lastIndexOf('-')+1, obj.day.length);

                let dia = new Date(anoInicio, mesInicio-1, diaInicio)

                let dataExistente = data.specific.filter(especifica => new Date(especifica.day).toLocaleDateString() === dia.toLocaleDateString());

                if(dataExistente.length > 0)
                    throw "Já existe uma regra para esta data, verifique"

                if(data.specific.length > 0)
                    id = data.specific[data.specific.length-1].id + 1;
                

                if(dia < new Date)
                    throw "Objeto inválido, verifique"

                return new regraEspecificaModel(id, new Date(anoInicio, mesInicio-1, diaInicio), obj.intervals);
                
            case 'd':
                if(!this.possuiValoresObrigatorios(obj, 'd'))
                    throw "Objeto inválido, verifique"
                
                if(data.daily.length > 0)
                    id = data.daily[data.daily.length-1].id + 1;
                return new regraDiariaModel(id, obj.intervals);

            case 'w':
                if(!this.possuiValoresObrigatorios(obj, 'w'))
                    throw "Objeto inválido, verifique"
                if(data.weekly.length > 0)
                    id = data.weekly[data.weekly.length-1].id + 1;
                return new regraSemanalModel(id, obj.weekdays, obj.intervals);

            default:  throw 'Tipo inválido, verifique!'
        }
    }

    // Função utilizada para validar os campos obrigatórios do objeto, caso exista algum faltante será retornado falso
    possuiValoresObrigatorios(obj, tipo) {
        switch(tipo){
            case 's':            
                if(obj.hasOwnProperty('day') && obj.hasOwnProperty('intervals'))
                    if(obj.intervals.length > 0)
                        return true;
            case 'd':
                if(obj.hasOwnProperty('intervals'))
                    if(obj.intervals.length > 0)
                        return true;
            case 'w':
                if(obj.hasOwnProperty('weekdays') && obj.hasOwnProperty('intervals'))
                    if(obj.intervals.length > 0)   
                        return true;            
        }
    
        return false;
    }

    // ------ Funções utilizadas para exclusão de regras ------ //

    //Função utilizada para remover determinado valor da lista
    removeValor(lista, id){
        //Filtro uma determinada regra pelo seu id, utilizando a função map para obter todos valores especificos
        //Em seguida pego o index do elemento que possui o id passado por parametro
        const removeIndex = lista.map(function(item) { return item.id; }).indexOf(id);

        //Caso o index retornado seja -1 significa que a regra não foi encontrada na lista
        if(removeIndex === -1)
            throw 'Não existe uma regra com este ID para este tipo, verifique!';

        //Removo a regra da lista sem alterar as demais informações da mesma
        lista.splice(removeIndex, 1);
        return lista;
    }
    

    // ------ Funções utilizadas para preparação de datas para retorno na listagem de horários ------ //
   
    //Função utilizada para obter a quantidade de dias no mes;
    diasNoMesSearch(mes, ano) {
        let data = new Date(ano, mes, 0);
        return data.getDate();
    }

    //Função utilizada para obter todas as datas dentro de um determinado périodo.
    obtemDatas(dataAtual, dataFim, inicio){
        let retorno = [];          

        let mesAtual = dataAtual.getMonth()+1;
        let anoAtual = dataAtual.getFullYear(); 
        let diasNoMes = this.diasNoMesSearch(mesAtual, anoAtual);
        let diaAtual = dataAtual.getDate();

        if(!inicio) {
            if (diaAtual === diasNoMes){  
                diaAtual = 1; //Caso seja o ultimo dia do mês é setado o dia atual como dia 1
                mesAtual += 1; //Também é alterado o mês;
            }else{
                diaAtual += 1;
            }
        }

        // Crio a data no formato de string para ser retornada ao usuário
        let novaData = [('0' + diaAtual).slice(-2), ('0' + mesAtual).slice(-2), anoAtual].join('-');

        // Caso ainda não tenha chegado ao fim do periodo chamo a função recursivamente para que contiue aplicando as regras as demais datas.
        if(novaData !== dataFim)
            retorno = this.obtemDatas(new Date(anoAtual, mesAtual-1,diaAtual), dataFim, false);

        // Obtenho intervalos com base nas regras válidas para as determinadas datas.
        let intervalos = this.obterIntervalos(new Date(anoAtual.toString(), (mesAtual-1).toString(),diaAtual.toString()));

        //Caso não exista nenhum intervalo não adiciono a data no retorno;
        if(intervalos.length > 0)
            retorno.push(new horarioModel(novaData,  intervalos));

        return retorno;
    }
    

    // Função utilizada para filtrar os intervalos com base nas regras existentes
    obterIntervalos(dia) {
        //Crio a array de intervalos
        let intervalos = [];

        //Filtro regras especificas para o dia em questão
        let regraEspecifica = data.specific.filter(especifica => new Date(especifica.day).toLocaleDateString() === dia.toLocaleDateString());

        // Caso exista regra para este dia aplico a mesma adicionando os intervalos a minha array que será retornada
        if(regraEspecifica.length > 0)
            intervalos = regraEspecifica[0].intervals;

        // Caso existam regras semanais verifico se alguma se encaixa ao dia em questão, eliminando os conflitos de horário
        if(data.weekly.length > 0){
            let regraSemanal = data.weekly.filter(semanal => semanal.weekdays.indexOf(dia.getDay()) !== -1);

            // Caso alguma se encaixe adiciono os intervalos a array de retorno
            if(regraSemanal.length > 0)
                intervalos = intervalos.concat(this.verificaConflitoHorario(regraSemanal[0].intervals, intervalos));
        }
        
        // Caso existam regras diárias adiciono as mesmas ao dia em referencia, eliminando os conflitos de horário
        if(data.daily.length > 0){
            for(let i = 0; i < data.daily.length; i++)
                intervalos = intervalos.concat(this.verificaConflitoHorario(data.daily[i].intervals, intervalos));
        }

        return intervalos;


    }

    //Função para verificar se existe conflito de horário entre duas listas
    verificaConflitoHorario(lista1, lista2){
        let retorno = []

        //Percorro a primeira lista e comparo cada valor com todos os valores da segunda lista
        //Caso um horário esteja em conflitando com um já existente informo que o mesmo é conflitante 
        for(let i = 0; i < lista1.length; i++){
            let conflito = false;
            let start1 = this.obterDataHora(lista1[i].start);
            let end1 =  this.obterDataHora(lista1[i].end);            
           
            for(let l = 0; l < lista2.length; l++){                
                let start2 = this.obterDataHora(lista2[i].start);
                let end2 = this.obterDataHora(lista2[i].end);
                if(start1 >= start2 && start1 <= end2 || end1 >= start2 && end1 <= end2)
                    conflito = true
            }

            // Caso o horário não tenha conflitos, será adicionado a lista de retorno.
            if(!conflito)
                retorno.push({start: lista1[i].start, end: lista1[i].end})
        }

        return retorno;
    }

    // Função utilizada para gerar uma data utilizando a hora em questão para que futuramente seja comparada a outra.
    obterDataHora(hora){

        hora = hora.split(':');  

        let d = new Date();
        let data = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hora[0], hora[1]);

        return data

    }   
    
    //Função utilizada para atualizar o conteúdo do json
    atualizaJson(){
        fs.writeFile('./config/data/data.json', JSON.stringify(data, null, 2), err => {if (err) throw err;}); 
    }
    
}

module.exports = regrasAtendimentoService;