/**
 * Created by alexfaber on 3/22/16.
 */
var assert = require('assert');

describe('Validator', function(){
    var validator = require('../../utilities/validator');
    describe('#isArrayOfTags', function(){
        it('should return true when array is valid', function(){
            var a = [
                {tagId: "56eedbd2a8f7da1c4981446d", content: "foobar"},
                {tagId: "56eedbd2a8f7da1c4981446c", content: "fez"}
            ];
            assert(validator.isArrayOfTags(a));
        });
        it('should return true when array is empty', function(){
            var a = [];
            assert(validator.isArrayOfTags(a));
        });
        it('should return false when array is invalid', function(){
            var a = [{foo: "bar"}];
            assert.equal(validator.isArrayOfTags(a), false);
        });
        it('should return false when array tags are invalid', function(){
            var a = [
                {tagId: "56eedbd2a8f7da1c4981446z", content: "foobar"},
                {tagId: "56eedbd2a8f7da1c4981446c", content: "fez"}
            ];
            assert.equal(validator.isArrayOfTags(a), false);
        });
        it('should return true when array is null', function(){
            assert(validator.isArrayOfTags(null));
        });
    });
    describe('#isArrayOfObjectIds', function(){
        it('should return true when array objectIds are valid', function(){
            var a = ["56eedbd2a8f7da1c4981446d", "56eedbd2a8f7da1c4981446c"];
            assert(validator.isArrayOfObjectIds(a));
        });
        it('should return true when array is empty', function(){
            var a = [];
            assert(validator.isArrayOfObjectIds(a));
        });
        it('should return false when array objectIds are invalid', function(){
            var a = ["56eedbd2a8f7da1c4981446z", "56eedbd2a8f7da1c4981446c"];
            assert.equal(validator.isArrayOfObjectIds(a), false);
        });
        it('should return true when array is null', function(){
            assert(validator.isArrayOfObjectIds(null));
        });
    });
});