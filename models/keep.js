/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var keepSchema = new Schema({
    userId: Schema.Types.ObjectId,
    date: Date,
    content: String
});

module.exports = mongoose.model('Keep', keepSchema);