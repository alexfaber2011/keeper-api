/**
 * Created by alexfaber on 3/22/16.
 */
var assert = require('assert');
var validators = require('../../utilities/expressValidatorOptions').customValidators;
var sanitizers = require('../../utilities/expressValidatorOptions').customSanitizers;

describe('Custom Validators for Express Validator Options', function(){
    describe('#isValidSortQuery', function(){
        it('should return true when query is valid', function(){
            assert(validators.isValidSortQuery("date"));
            assert(validators.isValidSortQuery("-date"));
            assert(validators.isValidSortQuery("name"));
            assert(validators.isValidSortQuery("-name"));
        });
        it('should return false when query is invalid', function(){
            assert.equal(validators.isValidSortQuery("-foo"), false);
        });
    });
});

describe('Custom Sanitizers for Express Validator Options', function(){
    describe('#toSortQuery', function(){
        it('should lowercase and remove space', function(){
            assert.equal(sanitizers.toSortQuery('-DATE'), '-date');
            assert.equal(sanitizers.toSortQuery('     -DATE    '), '-date');
        });
    });
});

describe('#isArrayOfTags', function(){
    it('should return true when array is valid', function(){
        var a = [
            {tagId: "56eedbd2a8f7da1c4981446d", description: "foobar"},
            {tagId: "56eedbd2a8f7da1c4981446c", description: "fez"}
        ];
        assert(validators.isArrayOfTags(a));
    });
    it('should return true when array is empty', function(){
        var a = [];
        assert(validators.isArrayOfTags(a));
    });
    it('should return false when array is invalid', function(){
        var a = [{foo: "bar"}];
        assert.equal(validators.isArrayOfTags(a), false);
    });
    it('should return false when array tags are invalid', function(){
        var a = [
            {tagId: "56eedbd2a8f7da1c4981446z", description: "foobar"},
            {tagId: "56eedbd2a8f7da1c4981446c", description: "fez"}
        ];
        assert.equal(validators.isArrayOfTags(a), false);
    });
    it('should return true when array is null', function(){
        assert(validators.isArrayOfTags(null));
    });
});
describe('#isArrayOfObjectIds', function(){
    it('should return true when array objectIds are valid', function(){
        var a = ["56eedbd2a8f7da1c4981446d", "56eedbd2a8f7da1c4981446c"];
        assert(validators.isArrayOfObjectIds(a));
    });
    it('should return true when array is empty', function(){
        var a = [];
        assert(validators.isArrayOfObjectIds(a));
    });
    it('should return false when array objectIds are invalid', function(){
        var a = ["56eedbd2a8f7da1c4981446z", "56eedbd2a8f7da1c4981446c"];
        assert.equal(validators.isArrayOfObjectIds(a), false);
    });
    it('should return true when array is null', function(){
        assert(validators.isArrayOfObjectIds(null));
    });
});