/**
 * Created by alexfaber on 3/20/16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
        userName: req.body.userName,
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

module.exports = router;
