/**
 * Created by alexfaber on 3/16/16.
 */
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Keep = require('../models/keep.js');

//CREATE - base
router.post('/', function(req, res){
    req.checkBody('date', 'required and must be a valid date').isDate();
    req.checkBody('tags', 'must be an array of tags').optional().isArrayOfTags();
    req.checkBody('people', 'must be an array of valid ObjectIds').optional().isArrayOfObjectIds();
    req.checkBody('content', 'required').isAscii();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
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
    req.checkQuery('fromDate', 'must be a valid date').optional().isDate();
    req.checkQuery('toDate', 'must be a valid date').optional().isDate();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var q = {userId: user._id};
    var dateQuery = {};
    var mutated = false;
    if(req.query.fromDate){
        dateQuery = _.extend(dateQuery, {$gte: new Date(req.query.fromDate)});
        mutated = true;
    }
    if(req.query.toDate){
        dateQuery = _.extend(dateQuery, {$lte: new Date(req.query.toDate)});
        mutated = true;
    }
    if(mutated){
        q.date = dateQuery;
    }
    Keep.find(q, function(err, keeps){
        if(err){
            res.status(500).json({message: "Unable to find Keeps", error: err});
        } else {
            res.json(keeps);
        }
    })
});

router.get('/:id', function(req, res) {
    var user = req.decoded;
    req.checkParams('id', 'required, must be a valid Mongo ObjectId').isMongoId();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    Keep.findOne({_id: req.params.id, userId: user._id}, function(err, keep){
        if(err) {
            res.status(500).json({message: "Unable to find Keep", error: err});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find Keep by id of: "  + req.params.id, error: err})
            return
        }
        res.json(keep);
    })
});

//UPDATE - base
router.put('/:id', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkBody('content', 'must be Ascii').optional().isAscii();
    req.checkBody('date', 'must be a valid date').optional().isDate();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var q = {};
    var mutated = false;
    if(req.body.content){
        q = _.extend(q, {content: req.body.content});
        mutated = true;
    }
    if(req.body.date){
        q = _.extend(q, {date: new Date(req.body.date)});
        mutated = true;
    }
    if(!mutated){
        res.status(400).json({message: "Must supply either a new date or new content"})
        return
    }
    Keep.findOneAndUpdate({_id: req.params.id, userId: user._id}, {$set: q}, {new: true}, function(err, keep){
        if(err){
            res.status(500).json({message: "Unable to update keep: " + req.params.id});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find Keep with id of: " + req.params.id});
            return
        }
        res.json(keep);
    })
});

//UPDATE - add people to a Keep
router.put('/:id/people', function(req, res){
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkBody('people', 'required, and must be an array of valid ObjectIds').isArrayOfObjectIds();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }
    var user = req.decoded;
    var query = {_id: req.params.id, userId: user._id};
    var updateQuery = {$addToSet: {people: {$each: req.body.people}}};
    Keep.findOneAndUpdate(query, updateQuery, {new: true}, function(err, keep){
        if(err){
            res.status(500).json({message: "Unable to find keep", error: err});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find keep with id of: " + req.params.id});
            return
        }
        res.json(keep);
    });
});

//UPDATE - add/update tag to Keep
router.put('/:id/tags', function(req, res){
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkBody('tagId', 'required, must be a valid Mongo ObjectID').isMongoId();
    req.checkBody('description', 'required, must be ascii').isAscii();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var user = req.decoded;
    //check to make sure
    Keep.findOne({_id: req.params.id, userId: user._id}, function(err, keep){
        if(err){
            res.status(500).json({message: "Unable to find keep", error: err});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find keep with id of: " + req.params.id});
            return
        }
        var tag = _.find(keep.tags, function(t){
            return t._id = req.body.tagId;
        });
        //If tag already exists, then update it.
        if(tag){
            tag.description = req.body.description;
            keep.tags = _.reject(keep.tags, function(t){
                return t._id = tag._id;
            });
            keep.tags.push(tag);
        } else {
            keep.tags.push({
                tagId: req.body.tagId,
                description: req.body.description
            });
        }
        keep.save(function(err){
            if(err){
                res.status(500).json({message: "Unable to save updated keep", error: err});
                return
            }
            res.json(keep);
        });
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

    Keep.findOneAndRemove({_id: req.params.id, userId: user._id}, function(err, keep){
        if(err){
            res.status(500).json({message: "Unable to delete keep: " + req.params.id});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find Keep with id of: " + req.params.id});
            return
        }
        res.json(keep);
    });
});

//DELETE - remove people from a Keep
router.delete('/:id/people', function(req, res){
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkBody('people', 'required, and must be an array of valid ObjectIds').isArrayOfObjectIds();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }

    var user = req.decoded;
    var query = {_id: req.params.id, userId: user._id};
    var updateQuery = {$pull: {people: {$in: req.body.people}}};
    Keep.findOneAndUpdate(query, updateQuery, {new: true}, function(err, keep){
        if(err){
            res.status(500).json({message: "Unable to find keep", error: err});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find keep with id of: " + req.params.id});
            return
        }
        res.json(keep);
    });
});

//DELETE - tag
router.delete('/:id/tag/:tagId', function(req, res){
    var user = req.decoded;
    req.checkParams('id', 'required, and must be valid Mongo ObjectID').isMongoId();
    req.checkParams('tagId', 'required, and must be valid Mongo ObjectID').isMongoId();
    var errors = req.validationErrors();
    if(errors){
        res.status(400).json({message: "There were validation errors", errors: errors});
        return
    }
    var query = {
        _id:  req.params.id,
        userId: user._id,
        'tags._id': req.params.tagId
    };
    Keep.findOneAndUpdate(query, {$pull: {tags: {_id: req.params.tagId}}}, {new: true}, function(err, keep){
        if(err){
            res.status(500).json({message: "Unable to delete keep tag", error: err});
            return
        }
        if(!keep){
            res.status(404).json({message: "Unable to find Keep with id of: " + req.params.id + " and tagId of: " + req.params.tagId});
            return
        }
        res.json(keep);
    });
});

module.exports = router;