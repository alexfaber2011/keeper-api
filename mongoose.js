/**
 * Created by alexfaber on 3/11/16.
 */
var mongoose = require('mongoose');
var config = require('./config');

var createMongoLabUri = function(id, port, dbName, user, password){
    return 'mongodb://' + user + ':' + password + '@' + id + '.mlab.com:' + port + '/' + dbName;
};


if (process.env.NODE_ENV == 'development') {
    mongoose.connect(createMongoLabUri('ds019950', 19950, 'clotho-dev-api', config.db.dev.user, config.db.dev.password))
} else {
    mongoose.connect(createMongoLabUri('ds019970', 19970, 'clotho-api', config.db.prod.user, config.db.prod.password));
}

module.exports = mongoose;