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

        const { nome, email, cargo, setor, esporte, tipoesporte } = queryResult.parameters;

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
            let lugares;
            await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
                params: {
                    query: `${esporte} ${tipoesporte}`,
                    location: '-3.0446423,-60.02062110000001',
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


        var intentMap = new Map();

        intentMap.set('cadastrarFuncionário', nomeFuncionario)
        intentMap.set('cadastrarFuncionário - yes', confirmacaoUsuario)
        intentMap.set('lerEmail - yes',confirmacaoUsuario)
        intentMap.set('lerEmail', lerEmail)
        intentMap.set('escolhaEsporte', escolherEsporte)

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

