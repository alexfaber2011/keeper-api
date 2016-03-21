/**
 * Created by alexfaber on 3/20/16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

router.post('/signup', function(req, res, next){
    req.checkBody('firstName', 'firstName is required and needs to be Alphanumeric').isAlphanumeric();
    req.checkBody('lastName', 'lastName is required and needs to be Alphanumeric').isAlphanumeric();
    req.checkBody('email', 'email is required and must be valid').isEmail();
    req.checkBody('password', 'password is required and needs to be Alphanumeric').isAlphanumeric();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err){
        if(err && err.code == 11000) {
            res.status(400).json({message: "Email is not unique", error: err})
        } else if(err){
            res.status(500).json({message: "Unable to create user", error: err});
        } else {
            console.log("cooL");
            res.json({message: "Success"});
        }
    });
});

router.post('/token', function(req, res, next){
    req.checkBody('email', 'email is required and must be valid').isEmail();
    req.checkBody('password', 'password is required and needs to be Alphanumeric').isAlphanumeric();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            res.status(500).json({
                success: false,
                message: "Error when checking for user with email: " + req.body.email,
                error: err
            });
            return
        }
        if(!user){
            res.status(404).json({
                success: false,
                message: "Unable to find user with email: " + req.body.email
            });
            return
        }
        if(user.password != req.body.password){
            res.status(401).json({
                success: false,
                message: "Passwords do not match"
            });
            return
        }
        jwt.sign(user, config.secret,{expiresIn: 86400}, function(token){
            res.json({success: true, token: token});
        });

    })
});

module.exports = router;
