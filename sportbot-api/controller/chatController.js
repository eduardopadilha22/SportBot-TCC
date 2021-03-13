const agentDiagflow = require('../agent');
const dfff = require('dialogflow-fulfillment');

module.exports = {
    /**
     * request utilizando como webhook do diagflow, enviando respostas para o Intent Definido
     * @param {*} req 
     * @param {*} resp 
     */
    async agentWebHook(req, resp) {
    const { queryResult } = req.body

    const agent = new dfff.WebhookClient({
        request: req,
        response: resp
    })

    const { parameters } = queryResult;

    console.log(parameters)

    function welcome(agent){
        agent.add(`Olá ao SportBot!`)
    }

    function fallback(agent){
        agent.add(`Desculpe, mas não compreendi.`)
    }

    function sportBot(agent){
        agent.add('Obrigado pela resposta!')
    }
    // function sportType(agent) {
    //     agent.add(`resposta -> ${queryResult.parameters.nameSport}`);
    // }
    
    
    var intentMap = new Map();
    
    // intentMap.set('webhookDemo',demo)
    
    intentMap.set('Default Welcome Intent',welcome)
    intentMap.set('Default Fallback Intent',fallback)
    intentMap.set('typeSport',sportBot)

    agent.handleRequest(intentMap)

    },

    /**
     * request passando a @queryInput e @sessionId para o Agent 
     */
    async agentDiagflow(req, resp){
        const { queryInput , sessionId } = req.body;
   
        const response =  await agentDiagflow.runSample(queryInput.text.text, sessionId , queryInput.text.languageCode);

        return resp.send(response);
    },

    /**
     * request para testar a Api
     * @param {*} req 
     * @param {*} resp 
     * @returns 
     */
    async teste(req,resp) {
        return resp.json({ message: 'testando minha oi'});
    }
    
    
}

