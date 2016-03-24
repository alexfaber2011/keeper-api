/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Person = require('../models/person.js');

//CREATE
router.post('/', function(req, res){
    req.checkBody('name', 'required').isAscii();
    req.checkBody('dateMet', 'must be a valid date').optional().isDate();
    req.checkBody('description', 'must be ascii').optional().isAscii();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var user = req.decoded;
    var newPerson = {
        userId: user._id,
        name: req.body.name
    };
    if(req.body.dateMet){
        newPerson.dateMet = new Date(req.body.dateMet);
    }
    if(req.body.description){
        newPerson.description = req.body.description;
    }
    var person = new Person(newPerson);
    person.save(function(err){
        if(err){
            res.status(500).json({message: "Unable to Add Person", error: err});
        } else {
            res.json(person);
        }
    });
});

//READ - ALL
router.get('/', function(req, res) {
    var user = req.decoded;
    req.checkQuery('sort', 'must be a sort query: name, -name').optional().isValidSortQuery();
    req.checkBody('name', 'must be ascii').optional().isAscii();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }
    req.sanitizeQuery('sort').toSortQuery();
    Person.find({userId: user._id}).sort(req.query.sort).exec(function(err, people){
        if(err){
            res.status(500).json({message: "Unable to find people", error: err});
        } else {
            res.json(people);
        }
    })
});

//READ - single
router.get('/:id', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be a valid Mongo ObjectID').isMongoId();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    Person.findOne({_id: req.params.id, userId: user._id}, function(err, person){
        if(err){
            res.status(500).json({message: "Unable to find person: " + req.params.id});
            return
        }
        if(!person){
            res.status(404).json({message: "Unable to find Person with id of: " + req.params.id});
            return
        }
        res.json(person);
    });
});

//UPDATE
router.put('/:id', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkBody('name', 'must be Ascii').optional().isAscii();
    req.checkBody('description', 'must be a valid date').optional().isAscii();
    req.checkBody('dateMet', 'must be a valid date').optional().isDate();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var q = {};
    var mutated = false;
    if(req.body.name){
        q = _.extend(q, {name: req.body.name});
        mutated = true;
    }
    if(req.body.description){
        q = _.extend(q, {description: req.body.description});
        mutated = true;
    }
    if(req.body.dateMet){
        q = _.extend(q, {dateMet: new Date(req.body.dateMet)});
        mutated = true;
    }
    if(!mutated){
        res.status(400).json({message: "Must supply either a new name, description, or dateMet"});
        return
    }
    Person.findOneAndUpdate({_id: req.params.id, userId: user._id}, {$set: q}, {new: true}, function(err, person){
        if(err){
            res.status(500).json({message: "Unable to update person: " + req.params.id});
            return
        }
        if(!person){
            res.status(404).json({message: "Unable to find Person with id of: " + req.params.id});
            return
        }
        res.json(person);
    });
});

//DELETE - base
router.delete('/:id', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    Person.findOneAndRemove({_id: req.params.id, userId: user._id}, function(err, person){
        if(err){
            res.status(500).json({message: "Unable to delete person: " + req.params.id});
            return
        }
        if(!person){
            res.status(404).json({message: "Unable to find Person with id of: " + req.params.id});
            return
        }
        res.json(person);
    });
});

module.exports = router;