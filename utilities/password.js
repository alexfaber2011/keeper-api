/**
 * Created by alexfaber on 3/30/16.
 */
var bcrypt = require('bcrypt');
var Q = require('q');

module.exports.hash = function(password){
    var deferred = Q.defer();
    bcrypt.hash(password, 5, function(err, hash){
        if(err){
            deferred.reject(err);
        } else {
            deferred.resolve(hash);
        }
    });
    return deferred.promise
};

module.exports.compare = function(password, hash){
    var deferred = Q.defer();
    bcrypt.compare(password, hash, function(err, res){
        if(err){
            deferred.reject(err);
        } else if(res == false){
            deferred.reject("Passwords do not match")
        } else {
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}