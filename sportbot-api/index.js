const express = require('express');
const app = express();
const routes = require('./routes').router
const cors = require('cors')
let mongoose = require('mongoose');

app.use(cors())
app.use(express.json());

 const uri = "mongodb+srv://sportbottcc:sportbottcc@sportbot.lolhr.mongodb.net/sportbotdb?retryWrites=true&w=majority";

//const uri = "mongodb://192.168.99.100/sportbot";

mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true });

var db = mongoose.connection;


if (!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

app.use(routes);

var porta = process.env.PORT || 8080;
app.listen(porta, () => console.log(`Server is live in Port 8080`))