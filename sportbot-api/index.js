const express = require('express');
const app = express();
const routes = require('./routes').router
const cors = require('cors')

app.use(cors())
app.use(express.json());

app.use(routes);


app.listen(3333,() => console.log(`Server is live in Port 3333`))