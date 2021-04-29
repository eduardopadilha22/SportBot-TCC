const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
require('dotenv').config()
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(message, sessionId, language, localizacao) {

  // A unique identifier for the given session
  // const sessionId = uuid.v4();
  const projectId = process.env.PROJECT_ID
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // let param1 = [];
  // let param2 = {};
  // let ctx = { 'name': '<context name>', 'lifespan': 5, 'parameters': { 'param1': param1, 'param2': param2 } };
  // agent.setContext(ctx);
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: message,
        // The language used by the client (en-US)
        languageCode: language,
      }
    },
    queryParams: {
      contexts: [
        {
          name: "projects/example1-d9fbd/agent/sessions/fasd/contexts/localizacao",

          /** Context lifespanCount */
          lifespanCount: 5,
          /** Context parameters */
          parameters: {
            fields: {
              latitude: { kind: 'numberValue', numberValue: localizacao.longitude },
              longitude: { kind: 'numberValue', numberValue: localizacao.latitude }
            }
          }
        }
      ],
    }
  };


  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }


  return result;
}

module.exports = {
  runSample
}
