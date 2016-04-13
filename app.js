/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var winston = require('winston');
var Papertrail = require('winston-papertrail').Papertrail;


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
    write: function (message, encoding) {
        logger.info(message);
    }
};


//Parse when application/json
app.use(bodyParser.json());
app.use(expressValidator(expressValidatorOptions));
app.use(morgan('dev', {"stream": logger.stream}));

//Add all controllers to our app with some authentication middleware
app.use(authentication.verify);
app.use(require('./controllers'));


if (process.env.NODE_ENV == 'development') {
    //If we're working on a development machine, start an express server that listens on port 3000
    app.listen(3000, function () {
        console.log('Listening on port 3000...');
    });
} else {
    var credentials = {
        key: fs.readFileSync('clotho.cloud/privkey.pem'),
        cert: fs.readFileSync('clotho.cloud/fullchain.pem'),
        ca: fs.readFileSync('clotho.cloud/chain.pem')
    };
    var httpServer = http.createServer(app);
    var httpsServer = https.createServer(credentials, app);

    httpServer.listen(80);
    httpsServer.listen(443);
    console.log("HTTP: listening on port 80");
    console.log("HTTPS: listening on port 443");
}

module.exports = app;