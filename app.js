/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var winston = require('winston'),
    Papertrail = require('winston-papertrail').Papertrail;


var authentication = require('./middlewares/authentication');
var expressValidatorOptions = require('./utilities/expressValidatorOptions');

//Setup Papertrail logging
var logger = new winston.Logger({
    transports: [
        new Papertrail({
            host: 'logs2.papertrailapp.com',
            port: 53195,
            colorize: true
        })
    ]
});

logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};


//Parse when application/json
app.use(bodyParser.json());
app.use(expressValidator(expressValidatorOptions));
app.use(morgan('dev', { "stream": logger.stream }));

//Add all controllers to our app with some authentication middleware
app.use(authentication.verify);
app.use(require('./controllers'));

app.listen(3000, function() {
    console.log('Listening on port 3000...')
});

module.exports = app;