const agentDiagflow = require('../agent');
const dfff = require('dialogflow-fulfillment');
const Usuario = require('../usuarioModel');
const axios = require('axios');

module.exports = {
    /**
     * request utilizando como webhook do diagflow, enviando respostas para o Intent Definido
     * @param {*} req 
     * @param {*} resp 
     */
    async agentWebHook(req, resp) {
        const { queryResult } = req.body
     //   https://maps.googleapis.com/maps/api/place/textsearch/json?query=campo+sintetico_manaus&key=AIzaSyBVdQuQ5nZdGUuV2j3Lo8BgPyckN80QgKs
        const agent = new dfff.WebhookClient({
            request: req,
            response: resp
        })

        const { nome, Idade, cargo, setor, esporte, tipoesporte } = queryResult.parameters;

        function fallback(agent) {
            agent.add(`Desculpe, mas não compreendi.`)
        }

        function nomeFuncionario(agent) {
            var usuario = new Usuario()
            usuario.nome = nome.name;
            usuario.idade = Idade;
            usuario.cargo = cargo;
            usuario.setor = setor;

            try {
                console.log('entrou aqui')
                usuario.save();
                agent.add(`Obrigado ${usuario.nome}, usuário está cadastrado, vamos pra o próximo passo ?`)
            } catch (error) {
                throw new Error('Deu Erro!')
            }
        }
        function sportBot(agent) {
            agent.add('Obrigado pela resposta!')
        }

        function confirmacaoUsuario(agent) {
            agent.add(`Agora vou lhe ajudar a encontrar lugares para a sua prática esportivas,
                        mas primeiro me diga o Seu esporte Favorito ?`);
        }

        function escolherEsporte(agent) {
        //     axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        //         params: {
        //             query: `${esporte} ${tipoesporte} Manaus`
        //         }
        //     }).then(function(response) {

        //     }).catch(function(error) )
        //     agent.add(`Entendi, seu esporte favorito é  ${esporte} do tipo ${tipoesporte}`);
        // }


        var intentMap = new Map();

        // intentMap.set('webhookDemo',demo)

        // intentMap.set('Default Welcome Intent',welcome)
        // intentMap.set('Default Fallback Intent',fallback)
        intentMap.set('typeSport', sportBot)
        intentMap.set('cadastrarFuncionário', nomeFuncionario)
        intentMap.set('cadastrarFuncionário - yes', confirmacaoUsuario)
        // intentMap.set('escolhaEsporte', escolherEsporte)

        agent.handleRequest(intentMap)

    },

    /**
     * request passando a @queryInput e @sessionId para o Agent 
     */
    async agentDiagflow(req, resp) {
        const { queryInput, sessionId } = req.body;

        const response = await agentDiagflow.runSample(queryInput.text.text, sessionId, queryInput.text.languageCode);

        return resp.send(response);
    },

    /**
     * request para testar a Api
     * @param {*} req 
     * @param {*} resp 
     * @returns 
     */
    async teste(req, resp) {
        return resp.json({ message: 'testando minha oi' });
    }


}

