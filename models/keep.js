/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/keeper-api');

var keepSchema = new Schema({
    date: Date,
    content: String
});

module.exports = mongoose.model('Keep', keepSchema);