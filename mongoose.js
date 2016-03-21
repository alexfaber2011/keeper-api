/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/keeper-api');

module.exports = mongoose;