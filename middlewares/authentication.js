/**
 * Created by alexfaber on 3/20/16.
 */
var jwt = require('jsonwebtoken');
var config = require('../config');

module.exports.verify = function(req, res, next){
    if(req.originalUrl == '/api/v1/auth/token' || req.originalUrl == '/api/v1/auth/signup'){
        return next();
    }

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(!token){
        res.status(403).json({success: false, message: "No Token Provided"});
        return
    }
    jwt.verify(token, config.secret, function(err, decoded){
        if(err){
            res.status(403).json({success: false, message: "Failed to authenticate token"});
            return
        }
        req.decoded = decoded._doc;
        next();
    });
};