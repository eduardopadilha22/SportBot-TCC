const express = require('express');

const router = express.Router();

const chatControler = require('./controller/chatController')

router.post('/', chatControler.agentWebHook)

router.get('/', chatControler.teste)

router.post('/change-bot', chatControler.agentDiagflow)

module.exports = {
    router
}