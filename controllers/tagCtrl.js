/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var validator = require('../utilities/validator');
var Tag = require('../models/tag.js');

//CREATE
router.post('/', function(req, res){
    req.checkBody('name', 'required').isAscii();
    req.checkBody('description', 'required').isAscii();
    req.checkBody('color', 'must be a valid hex color').optional().isHexColor();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var user = req.decoded;
    var newTag = {
        userId: user._id,
        name: req.body.name,
        description: req.body.description
    };
    if(req.body.color){
        newTag.color = req.body.color.replace("#", "");
    }
    var tag = new Tag(newTag);
    tag.save(function(err){
        if(err){
            res.status(500).json({message: "Unable to Add Tag", error: err});
        } else {
            res.json(tag);
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
    Tag.find({userId: user._id}).sort(req.query.sort).exec(function(err, tags){
        if(err){
            res.status(500).json({message: "Unable to find tags", error: err});
        } else {
            res.json(tags);
        }
    })
});

router.get('/:id', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be a valid Mongo ObjectID').isMongoId();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    Tag.findOne({_id: req.params.id, userId: user._id}, function(err, tag){
        if(err){
            res.status(500).json({message: "Unable to find tag: " + req.params.id});
            return
        }
        if(!tag){
            res.status(404).json({message: "Unable to find Tag with id of: " + req.params.id});
            return
        }
        res.json(tag);
    })
});

//UPDATE
router.put('/:id', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkBody('name', 'must be Ascii').optional().isAscii();
    req.checkBody('description', 'must be a valid date').optional().isAscii();
    req.checkBody('color', 'must be a valid date').optional().isHexColor();
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
        q = _.extend(q, {date: req.body.description});
        mutated = true;
    }
    if(req.body.color){
        q = _.extend(q, {color: req.body.color.replace("#", '')});
        mutated = true;
    }
    if(!mutated){
        res.status(400).json({message: "Must supply either a new name, description, or color"});
        return
    }
    Tag.findOneAndUpdate({_id: req.params.id, userId: user._id}, {$set: q}, {new: true}, function(err, tag){
        if(err){
            res.status(500).json({message: "Unable to update tag: " + req.params.id});
            return
        }
        if(!tag){
            res.status(404).json({message: "Unable to find Tag with id of: " + req.params.id});
            return
        }
        res.json(tag);
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

    Tag.findOneAndRemove({_id: req.params.id, userId: user._id}, function(err, tag){
        if(err){
            res.status(500).json({message: "Unable to delete tag: " + req.params.id});
            return
        }
        if(!tag){
            res.status(404).json({message: "Unable to find Tag with id of: " + req.params.id});
            return
        }
        res.json(tag);
    });
});

module.exports = router;