/* jshint mocha: true */

'use strict';
var server = require('../server');
var app = server.app;
var request = require('request');
var should = require('should');
var Sequelize = require('sequelize');


var postgresURL = 'postgres://pumpup:pumpup@localhost:5432/pumpup_db';
var sequelize = new Sequelize(postgresURL);
var port = server.port;
var User = server.User;

var testURL = 'http://localhost:' + port;

// convenience function
var makeRequest = function makeRequest(path, method, data, callback) {
    request({
        url: testURL + path,
        method: method,
        json: true,
        body: data
    }, callback);
};

describe('Pump Up API Routes', function() {
    // before all tests, start the API
    before(function () {
        app.listen(port);
    });

    // describe('POST /log', function () {
    //     it('{actionId}', function (done) {
    //         var log = {
    //             actionId: 'LOG_TEST'
    //         };

    //         makeRequest('/log', 'POST', log, function(err, resp, body) {
    //             resp.should.have.property('statusCode', 200);
    //             body.should.have.property('success', true);
    //             done();
    //         });
    //     });

    //     it('{actionId, userId}', function (done) {
    //         var log = {
    //             actionId: 'LOG_TEST',
    //             userId: 1
    //         };

    //         makeRequest('/log', 'POST', log, function(err, resp, body) {
    //             resp.should.have.property('statusCode', 200);
    //             body.should.have.property('success', true);
    //             done();
    //         });
    //     });

    //     it('{actionId, userId, data}', function (done) {
    //         var log = {
    //             actionId: 'LOG_TEST',
    //             userId: 1,
    //             data: {
    //                 hello: 'world'
    //             }
    //         };

    //         makeRequest('/log', 'POST', log, function(err, resp, body) {
    //             resp.should.have.property('statusCode', 200);
    //             body.should.have.property('success', true);
    //             done();
    //         });
    //     });

    //     it('{}', function (done) {
    //         var log = {};

    //         makeRequest('/log', 'POST', log, function(err, resp, body) {
    //             resp.should.have.property('statusCode', 400);
    //             body.should.have.property('success', true);
    //             done();
    //         });
    //     });
    // });

    describe('POST /classes/user', function () {
        it('{name, email, password}', function (done) {
            var user = {
                name: 'jon',
                email: 'jon@jonny.io',
                password: '12345'
            };

            makeRequest('/classes/user', 'POST', user, function(err, resp, body) {
                resp.should.have.property('statusCode', 201);
                body.should.have.property('success', true);
                body.data.should.have.property('name').which.is.equal(user.name);
                done();
            });
        });

        it('{name, email}', function (done) {
            var user = {
                name: 'jon',
                email: 'jon@jonny.io'
            };

            makeRequest('/classes/user', 'POST', user, function(err, resp, body) {
                resp.should.have.property('statusCode', 400);
                done();
            });
        });

        after(function (done) {
            User.findOne({where: {email: 'jon@jonny.io'}}).then(function (user) {
                user.destroy();
                done();
            });

        });
    });

    // describe('PUT /classes/user/:id', function () {
    //     before(function () {
    //         var user = {
    //             name: 'jon',
    //             email: 'jon@jonny.io',
    //             password: '12345'
    //         };

    //         makeRequest('/classes/user', 'POST', user, function(err, resp, body) {
    //             // todo: status code should = 201
    //             // todo: body.success = true
    //             // todo: body.data should = base body object
    //         });
    //     });

    //     it('{password}', function (done) {
    //         var user = {
    //             password: '56789'
    //         };

    //         makeRequest('/classes/user', 'POST', user, function(err, resp, body) {
    //             // todo: status code should = 200
    //             // todo: body.success = true
    //             // todo: body.data.password should = '56789'
    //             done();
    //         });
    //     });

    //     it('{password, email}', function (done) {
    //         var user = {
    //             email: 'jon@gmail.com',
    //             password: '56789'
    //         };

    //         makeRequest('/classes/user', 'POST', user, function(err, resp, body) {
    //             // todo: status code should = 200
    //             // todo: body.success = true
    //             // todo: body.data.password should = '56789'
    //             // todo: body.data.email should = 'jon@jonny.io'
    //             done();
    //         });
    //     });

    //     after(function () {
    //         // todo: delete dummy user
    //     });
    // });
});
