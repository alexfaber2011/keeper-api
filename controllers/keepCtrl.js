/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();
var validator = require('../utilities/validator');
var Keep = require('../models/keep.js');

//CREATE
router.post('/', function(req, res){
    req.checkBody('date', 'required and must be a valid date').isDate();
    req.checkBody('content', 'required').isAscii();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }
    if(!validator.isArrayOfTags(req.body.tags)){
        res.status(400).json({message: "field tags, must be a valid array of tags"});
        return
    }
    if(!validator.isArrayOfObjectIds(req.body.people)){
        res.status(400).json({message: "field people, must be an array of objectIds"});
        return
    }
    var user = req.decoded;
    var newKeep = {
        userId: user._id,
        date: new Date(req.body.date),
        content: req.body.content
    };
    if(req.body.tags){
        newKeep.tags = req.body.tags;
    }
    if(req.body.people){
        newKeep.people = req.body.people;
    }
    var keep = new Keep(newKeep);
    keep.save(function(err){
        if(err){
            res.status(500).json({message: "Unable to Add Keep", error: err});
        } else {
            res.json(keep);
        }
    });
});

//READ - ALL
router.get('/', function(req, res) {
    var user = req.decoded;
    Keep.find({userId: user._id}, function(err, keeps){
        if(err){
            res.status(500).json({message: "Unable to find Keeps", error: err});
        } else {
            res.json(keeps);
        }
    })
});

module.exports = router;