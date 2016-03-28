/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('mongoose');
var config = require('./config');

if (process.env.NODE_ENV == 'development') {
    mongoose.connect('mongodb://localhost/keeper-api');
} else {
    var uri = 'mongodb://ds025439.mlab.com:25439/keeper-api';
    var options = {user: config.db.user, pass: config.db.password};
    mongoose.connect(uri, options);
}

module.exports = mongoose;