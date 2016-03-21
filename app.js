/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');

var config = require('./config');

//Parse when application/json
app.use(bodyParser.json());
app.use(expressValidator());

app.use(morgan('dev'));

//Add all controllers to our app
app.use(require('./controllers'));

app.listen(3000, function() {
    console.log('Listening on port 3000...')
});