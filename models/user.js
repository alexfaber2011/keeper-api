/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);