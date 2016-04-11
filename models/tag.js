/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color: String
});

tagSchema.index({ name: 1, userId: 1}, { unique: true });


module.exports = mongoose.model('Tag', tagSchema);