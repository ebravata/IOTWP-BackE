// variables de entorno
require ('dotenv').config();

const express = require('express');
const cors = require('cors')
const path = require('path');
const os = require('os');
const bodyParser = require('body-parser');
const app = express();

process.env.TZ = "America/Mexico_city";

console.log(new Date().toString());

app.set('port', 3000);




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


// app.use(express.static(path.join(__dirname, 'public')));

// config cors
app.use(cors())

// rutas
app.use ('/api', require('./routes/routes'));


app.get('*', (req, res) => {
  res.sendFile( path.resolve (__dirname, 'public/index.html'))
});

app.listen(app.get('port'), () => {
      console.log(`Listening on ${app.get('port')}.`);
    });


