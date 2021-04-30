const agentDiagflow = require('../agent');
const dfff = require('dialogflow-fulfillment');
const Usuario = require('../usuarioModel');
const axios = require('axios');
const { Payload } = require("dialogflow-fulfillment");
const { error } = require('actions-on-google/dist/common');

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



        const { nome, email, cargo, setor, esporte, tipoesporte, questao1, questao2 } = queryResult.parameters;

        function fallback(agent) {
            agent.add(`Desculpe, mas não compreendi.`)
        }


        async function nomeFuncionario(agent) {
            var usuario = new Usuario()
            usuario.nome = nome.name;
            usuario.email = email;
            usuario.cargo = cargo;
            usuario.setor = setor;

            try {
                await usuario.save();
                agent.add(`Obrigado ${usuario.nome}, usuário está cadastrado, vamos pra o próximo passo ?`)
            } catch (error) {
                throw new Error(error.message)
            }
        }

        function confirmacaoUsuario(agent) {
            agent.add(`Agora vou lhe ajudar a encontrar lugares para a sua prática esportivas,  mas primeiro me diga o Seu esporte Favorito ?`);
        }

        async function escolherEsporte(agent) {

            let contextoLocalizacao = null;
            for (let contexto of req.body.queryResult.outputContexts) {
                const nameContexto = contexto.name.split('/');
                const ultima = nameContexto[nameContexto.length - 1];
                if (ultima === 'localizacao') {
                    contextoLocalizacao = contexto;
                }
            }
            console.log(contextoLocalizacao.parameters)
            let lugares;
            await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: {
                    query: `${esporte} ${tipoesporte}`,
                    location: `${contextoLocalizacao.parameters.latitude},${contextoLocalizacao.parameters.longitude}`,
                    radius: 1000,
                    key: process.env.KEY_MAPS
                }
            }).then(function (response) {
                lugares = response.data.results;
            }).catch(function (error) {
                throw new Error(error.message)
            });

            const payload = {
                lugares: JSON.stringify(lugares)
            };

            await agent.add(
                new Payload(agent.UNSPECIFIED, payload, { rawPayload: true, sendAsMessage: true })
            );



        }

        async function lerEmail(agent) {
            const usuarioEncontrado = await Usuario.find({ email: email });

            if (usuarioEncontrado.length == 0) {
                agent.add(usuarioEncontrado == '' ? 'Desculpe 😕 , esse e-mail não existe na Plataforma, deseja fazer um Cadastro? digite "quero cadastrar" ou digite seu e-mail novamente' : 'achou');
            } else
                agent.add(`Obrigado ${usuarioEncontrado[0].nome}, Bem-vindo novamente, vamos pra o próximo passo ?`)

        }

        async function satisfacao(agent) {

            // const contexto = req.body.queryResult.outputContexts[2].parameters.nome !== undefined ? req.body.queryResult.outputContexts[2]
            //     : req.body.queryResult.outputContexts[0];

            const { parameters } = req.body.queryResult.outputContexts[0];

            let usuarioEncontrado = null;
            if (parameters.email !== undefined) {

                usuarioEncontrado = await Usuario.find({ email: parameters.email });
            }

            await axios.post(
                'https://sheet.best/api/sheets/9a825958-9166-4e6e-915e-ec64a33b2acd',
                {
                    Usuario: usuarioEncontrado ? usuarioEncontrado[0].nome : parameters.nome.name,
                    Questao1: questao1,
                    Questao2: questao2
                }
            );
            await agent.add('Agradeço pela sua confiança!')
        }


        var intentMap = new Map();

        intentMap.set('cadastrarFuncionário', nomeFuncionario)
        intentMap.set('cadastrarFuncionário - yes', confirmacaoUsuario)
        intentMap.set('lerEmail - yes', confirmacaoUsuario)
        intentMap.set('lerEmail', lerEmail)
        intentMap.set('escolhaEsporte', escolherEsporte)
        intentMap.set('escolhaEsporte - yes', satisfacao)

        agent.handleRequest(intentMap)

    },

    /**
     * request passando a @queryInput e @sessionId para o Agent 
     */
    async agentDiagflow(req, resp) {
        const { queryInput, sessionId, localizacao } = req.body;

        const response = await agentDiagflow.runSample(queryInput.text.text, sessionId, queryInput.text.languageCode, localizacao);

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

