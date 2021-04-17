const express = require('express');
const app = express();
const routes = require('./routes').router
const cors = require('cors')
let mongoose = require('mongoose');

app.use(cors())
app.use(express.json());

mongoose.connect('mongodb://192.168.99.100/sportbot', { useNewUrlParser: true });

var db = mongoose.connection;


if (!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

app.use(routes);


app.listen(3333, () => console.log(`Server is live in Port 3333`))