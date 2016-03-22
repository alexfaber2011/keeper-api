/**
 * Created by alexfaber on 3/22/16.
 */

var _ = require('underscore');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    isArrayOfTags: function(arr){
        if(_.isNull(arr) || _.isUndefined(arr)){
            return true;
        }
        if(!Array.isArray(arr)){
            return false;
        }
        return _.every(arr, function(v){
            return (_.isObject(v) && _.has(v, 'tagId') && _.has(v, 'content') && ObjectId.isValid(v.tagId));
        });
    },
    isArrayOfObjectIds: function(arr){
        if(_.isNull(arr) || _.isUndefined(arr)){
            return true;
        }
        if(!Array.isArray(arr)){
            return false;
        }
        return _.every(arr, function(i){
            return ObjectId.isValid(i);
        });
    }
};