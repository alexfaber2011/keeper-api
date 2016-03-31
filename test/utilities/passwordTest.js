/**
 * Created by alexfaber on 3/22/16.
 */
var assert = require('assert');
var password = require('../../utilities/password');
var hoistedHash;

describe('Password Utility', function(){
    describe('#hash', function(){
        it('should hash to something other than "foo"', function(done){
            password.hash("foo")
                .then(function(hashedPassword){
                    hoistedHash = hashedPassword;
                    assert.notEqual(hashedPassword, "foo");
                    done();
                })
                .catch(function(err){
                    assert(false, "Received and Error when we shouldn't have.")
                    done();
                });
        });
    });
    describe('#compare', function(){
        it('should return hash to the same value when query is invalid', function(done){
            password.compare('foo', hoistedHash)
                .then(function(res){
                    assert(res);
                    done()
                })
                .catch(function(res){
                    assert(res, 'compare should have succeeded')
                    done();
                });
        });
        it('should not compare correctly', function(done){
            password.compare('bar', hoistedHash)
                .then(function(res){
                    assert(false, "compare shouldn't have succeeded");
                    done();
                })
                .catch(function(res){
                    assert(true);
                    done();
                })
        });
    });
});