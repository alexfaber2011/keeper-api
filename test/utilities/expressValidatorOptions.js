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