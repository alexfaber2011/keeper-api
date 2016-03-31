/**
 * Created by alexfaber on 3/20/16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');
var password = require('../utilities/password');

router.post('/signup', function(req, res, next){
    req.checkBody('firstName', 'firstName is required and needs to be Alphanumeric').isAlphanumeric();
    req.checkBody('lastName', 'lastName is required and needs to be Alphanumeric').isAlphanumeric();
    req.checkBody('email', 'email is required and must be valid').isEmail();
    req.checkBody('password', 'password is required, needs to be 6-70 characters long, and needs to be Alphanumeric').isLength({min: 6, max: 70}).isAscii();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    password.hash(req.body.password)
        .then(function(hash){
            var user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
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
        })
        .catch(function(err){
            res.status(500).json({message: "Error when encrypting password", error: err})
        });
});

router.post('/token', function(req, res, next){
    req.checkBody('email', 'email is required and must be valid').isEmail();
    req.checkBody('password', 'password is required, needs to be 6-70 characters long, and needs to be Alphanumeric').isLength(6, 70).isAscii();
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
        password.compare(req.body.password, user.password)
            .then(function(){
                jwt.sign(user, config.secret,{expiresIn: 86400}, function(token){
                    res.json({success: true, token: token});
                });
            })
            .catch(function(){
                res.status(401).json({
                    success: false,
                    message: "Passwords do not match"
                });
            });
    });
});

module.exports = router;
