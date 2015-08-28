module.exports = function (deps) {
    'use strict';

    var request = require('request-promise'),
        loggy = require('../controllers/loggy')({});

    // unpack deps
    var User = deps.User;

    // POST /log
    var logRoute = function* (next) {
        var data = this.request.body;
        if (!data || !data.actionId) {
            this.throw(400, 'Log requires at least actionId');
        }

        // use loggy controller to send log
        try {
            loggy.log(data);
        } catch (e) {
            this.throw(500, 'Unable to communicate with log server');
        }

        this.response.status = 200;
        this.response.body = data;

        // serves no real purpose other than to get jshint to shut up
        yield next;
    };

    // POST /classes/user
    var userCreateRoute = function* (next) {
        var data = this.request.body;
        if (!data || !data.name || !data.email || !data.password) {
            this.throw(400, 'New user requires name, email and password properties.');
        }

        var user = yield User.create(data).catch(function (err) {
            // This block is required to catch constraint errors
            // (to due with the unique email constraint)
        });

        if (!user) {
            this.throw(406, 'Could not create user');
        }

        // everything was ok - send response
        this.response.status = 201;
        this.response.body = user;

        // create log request
        var logData = {
            actionId: 'USER_SIGNUP',
            data: data
        };
        var logResponse = yield request({
            url: 'http://localhost:3000/log',
            method: 'POST',
            json: true,
            body: logData
        });
    };

    // PUT /classes/user/:id
    var userUpdateRoute = function* (next) {
        var data = this.request.body;
        if (!data) {
            this.throw(400, 'Requires data to update user with.');
        }

        // find user to update;
        var user = yield User.findById(this.params.id);
        if (!user) {
            this.throw(404, 'User not found');
        }

        // update user
        var updated = yield user.update(data);
        if (!updated) {
            this.throw(500, 'Failed to update user');
        }

        // everything was ok - send response
        this.response.status = 200;
        this.response.body = user;

        // create log request
        var logData = {
            actionId: 'USER_EDIT_PROFILE',
            userId: user.id,
            data: data
        };
        var logResponse = yield request({
            url: 'http://localhost:3000/log',
            method: 'POST',
            json: true,
            body: logData
        });
    };

    return {
        logRoute: logRoute,
        userCreateRoute: userCreateRoute,
        userUpdateRoute: userUpdateRoute
    };
};
