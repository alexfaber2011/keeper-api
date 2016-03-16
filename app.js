/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var app = express();

app.use(require('./controllers'));

app.listen(3000, function() {
    console.log('Listening on port 3000...')
});