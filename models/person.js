/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dateMet: Date,
    description: String
});

personSchema.index({name: 1, userId: 1}, { unique: true });

module.exports = mongoose.model('Person', personSchema);