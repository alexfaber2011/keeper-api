/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();
var Keep = require('../models/keep.js');

router.get('/', function(req, res) {
    res.json({message: "You've hit the Keep route"});
});

router.post('/', function(req, res){
    var keep = new Keep({
        date: new Date(),
        content: "This is a test Keep"
    });
    keep.save(function(err){
        if(err){
            res.status(500).json({message: "Unable to Add user", error: err});
        } else {
            res.json({message: "Successfully Added User to DB"});
        }
    });
});

module.exports = router;