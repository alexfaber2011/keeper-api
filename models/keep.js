/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('../mongoose');
var Schema = mongoose.Schema;

var keepSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        tagId: Schema.Types.ObjectId,
        description: String
    }],
    people: [Schema.Types.ObjectId]
});

keepSchema.index({ date: 1, userId: 1}, { unique: true });

module.exports = mongoose.model('Keep', keepSchema);