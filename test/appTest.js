/**
 * Created by alexfaber on 4/8/16.
 */
var request = require('supertest');
var expect = require('chai').expect;
var assert = require('chai').assert;
var app = require('../app');
var User = require('../models/user');

// CONSTANTS
var apiContext = '/api/v1';

// HELPER FUNCTIONS
var handleError = function(err){
    if(err){
        assert.fail();
    }
};

//HOISTED VARIABLES
var alexToken, fooToken, keepId, runningTagId, paintingTagId, personBobId, personFrankId;

describe('POST /auth/signup', function(){
    it('should return a successful message', function(done){
        request(app)
            .post(apiContext + '/auth/signup')
            .send({
                "firstName": "Alex",
                "lastName": "Faber",
                "password": "It'sAS#cre1",
                "email": "alexfaber2011@gmail.com"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('it should not allow a redundant email', function(done){
        request(app)
            .post(apiContext + '/auth/signup')
            .send({
                "firstName": "Alex",
                "lastName": "Faber",
                "password": "It'sAS#cre1",
                "email": "alexfaber2011@gmail.com"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(400);
                done();
            });
    });
    it('it should create another user', function(done){
        request(app)
            .post(apiContext + '/auth/signup')
            .send({
                "firstName": "Alex",
                "lastName": "Faber",
                "password": "It'sAS#cre1",
                "email": "foo@gmail.com"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                done();
            });
    });
});

describe('POST /auth/token', function(){
    it('should give the user back a proper token', function(done){
        request(app)
            .post(apiContext + '/auth/token')
            .send({
                "password": "It'sAS#cre1",
                "email": "alexfaber2011@gmail.com"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                alexToken = res.body.token;
                done();
            });
    });
    it('should not give the user back a proper token', function(done){
        request(app)
            .post(apiContext + '/auth/token')
            .send({
                "password": "It'sAS#cre2",
                "email": "alexfaber2011@gmail.com"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
    it('should give another user back a proper token', function(done){
        request(app)
            .post(apiContext + '/auth/token')
            .send({
                "password": "It'sAS#cre1",
                "email": "foo@gmail.com"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                fooToken = res.body.token;
                done();
            });
    });
});

describe('POST /tags', function(){
    it('should let Alex create a running tag', function(done){
        request(app)
            .post(apiContext + '/tags')
            .set('x-access-token', alexToken)
            .send({
                "name": "Run",
                "description": "Went for a run today",
                "color": "#fff"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                runningTagId = res.body._id;
                done();
            });
    });
    it('should not let Alex create a running tag again', function(done){
        request(app)
            .post(apiContext + '/tags')
            .set('x-access-token', alexToken)
            .send({
                "name": "Run",
                "description": "Went for a run today",
                "color": "#fff"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
    it('should let Foo create a running tag', function(done){
        request(app)
            .post(apiContext + '/tags')
            .set('x-access-token', fooToken)
            .send({
                "name": "Run",
                "description": "Went for a run today",
                "color": "#fff"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                done();
            });
    });
    it('should let Foo create a painting tag', function(done){
        request(app)
            .post(apiContext + '/tags')
            .set('x-access-token', fooToken)
            .send({
                "name": "Paint",
                "description": "I spent at least 15 minutes of my day painting",
                "color": "#fff"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                paintingTagId = res.body._id;
                done();
            });
    });
});

describe('PUT /tags', function(){
    it('should allow Alex to update his running tag', function(done){
        request(app)
            .put(apiContext + '/tags/' + runningTagId)
            .set('x-access-token', alexToken)
            .send({
                "description": "I went for a significant run today",
                "color": "#fff"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.description).to.equal("I went for a significant run today");
                done();
            });
    });
    it('should not allow Alex to update his Foo\'s painting tag', function(done){
        request(app)
            .put(apiContext + '/tags/' + paintingTagId)
            .set('x-access-token', alexToken)
            .send({
                "description": "Foo, I'm hijacking your tag"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
});

describe('DELETE /tags', function(){
    it('should not allow Alex to delete his Foo\'s painting tag', function(done){
        request(app)
            .delete(apiContext + '/tags/' + paintingTagId)
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
    it('should allow Foo to delete his painting tag', function(done){
        request(app)
            .delete(apiContext + '/tags/' + paintingTagId)
            .set('x-access-token', fooToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                done();
            });
    });
});

describe('GET /tags', function(){
    it('should allow Alex see 1 tag', function(done){
        request(app)
            .get(apiContext + '/tags')
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
    });
    it('should show Foo 1 tags', function(done){
        request(app)
            .get(apiContext + '/tags')
            .set('x-access-token', fooToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
    });
});

describe('POST /people', function(){
    it('should allow Alex to add a Bob', function(done){
        request(app)
            .post(apiContext + '/people')
            .set('x-access-token', alexToken)
            .send({
                dateMet: '03/01/1991',
                description: 'looney dude',
                name: 'Bob'
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal('Bob');
                personBobId = res.body._id;
                done();
            });
    });
    it('should allow allow Foo to add a Bob', function(done){
        request(app)
            .post(apiContext + '/people')
            .set('x-access-token', fooToken)
            .send({
                dateMet: '03/01/1991',
                description: 'looney dude',
                name: 'Bob'
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal('Bob');
                done();
            });
    });
    it('should not allow Foo to add a Bob again', function(done){
        request(app)
            .post(apiContext + '/people')
            .set('x-access-token', fooToken)
            .send({
                dateMet: '03/01/1991',
                description: 'looney dude',
                name: 'Bob'
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
    it('should allow Foo to add a Frank again', function(done){
        request(app)
            .post(apiContext + '/people')
            .set('x-access-token', fooToken)
            .send({
                dateMet: '03/01/1991',
                description: 'looney dude',
                name: 'Frank'
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.name).to.equal('Frank');
                done();
            });
    });
});

describe('GET /people', function(){
    it('should allow Alex to read 1 person', function(done){
        request(app)
            .get(apiContext + '/people')
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
    });
    it('should allow Foo to read 2 people', function(done){
        request(app)
            .get(apiContext + '/people')
            .set('x-access-token', fooToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.length(2);
                done();
            });
    });
});

describe('PUT /people/:id', function(){
    it('should allow Alex to update Bob', function(done){
        request(app)
            .put(apiContext + '/people/' + personBobId)
            .set('x-access-token', alexToken)
            .send({
                description: 'foo'
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.description).to.equal('foo');
                done();
            });
    });
    it('should not allow Alex to update Frank', function(done){
        request(app)
            .get(apiContext + '/people/' + personFrankId)
            .set('x-access-token', alexToken)
            .send({
                description: 'foo'
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
});

describe('DELETE /people/:id', function(){
    it('should not allow Alex to delete Frank', function(done){
        request(app)
            .delete(apiContext + '/people/' + personFrankId)
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
    it('should allow Alex to delete Bob', function(done){
        request(app)
            .delete(apiContext + '/people/' + personBobId)
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                done();
            });
    });
});

describe('POST /keeps', function(){
    it('should let Alex POST a keep', function(done){
        request(app)
            .post(apiContext + '/keeps')
            .set('x-access-token', alexToken)
            .send({
                "date": "03/28/2015",
                "content": "Hello!"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                keepId = res.body._id;
                done();
            });
    });
    it('should not Alex POST keep with same date', function(done){
        request(app)
            .post(apiContext + '/keeps')
            .set('x-access-token', alexToken)
            .send({
                "date": "03/28/2015",
                "content": "Hello!"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
    it('should let Foo POST a keep with the same date', function(done){
        request(app)
            .post(apiContext + '/keeps')
            .set('x-access-token', fooToken)
            .send({
                "date": "03/28/2015",
                "content": "Hello!"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                done();
            });
    });
});

describe('GET /keeps', function(){
    it('Alex should only see 1 keep', function(done){
        request(app)
            .get(apiContext + '/keeps')
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
    });
    it('Foo should only see 1 keep', function(done){
        request(app)
            .get(apiContext + '/keeps')
            .set('x-access-token', fooToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.length(1);
                done();
            });
    });
});

describe('PUT /keeps/:id', function(){
    it('Alex should be able to update a Keep', function(done){
        request(app)
            .put(apiContext + '/keeps/' + keepId)
            .set('x-access-token', alexToken)
            .send({
                "date": "03/28/2015",
                "content": "Updated"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.content).to.equal("Updated");
                done();
            });
    });
    it('Foo should not be able to update a Alex\'s Keep', function(done){
        request(app)
            .put(apiContext + '/keeps/' + keepId)
            .set('x-access-token', fooToken)
            .send({
                "date": "03/28/2015",
                "content": "Updated"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.not.equal(200);
                done();
            });
    });
});

describe('/keeps/:id/people', function(){
    it('should allow Alex to be able to add personBob to Keep', function(done){
        request(app)
            .put(apiContext + '/keeps/' + keepId + '/people')
            .set('x-access-token', alexToken)
            .send({
                "people": [personBobId]
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.people).to.have.length(1);
                done();
            });
    });
    it('should allow Alex to remove personBob to Keep', function(done){
        request(app)
            .delete(apiContext + '/keeps/' + keepId + '/people')
            .set('x-access-token', alexToken)
            .send({
                "people": [personBobId]
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.people).to.have.length(0);
                done();
            });
    });
});

var tagInstance;
describe('/keeps/:id/tags', function(){
    it('should allow Alex to be able to add paintingTag to Keep', function(done){
        request(app)
            .put(apiContext + '/keeps/' + keepId + '/tags')
            .set('x-access-token', alexToken)
            .send({
                "tagId": runningTagId,
                "description": "Did some painting today"
            })
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.tags).to.have.length(1);
                tagInstance = res.body.tags[0]._id;
                done();
            });
    });
    it('should allow Alex to remove paintingTag from Keep', function(done){
        request(app)
            .delete(apiContext + '/keeps/' + keepId + '/tag/' + tagInstance)
            .set('x-access-token', alexToken)
            .end(function(err, res){
                handleError(err);
                expect(res.status).to.equal(200);
                expect(res.body.tags).to.have.length(0);
                done();
            });
    });
});