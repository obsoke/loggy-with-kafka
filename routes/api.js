module.exports = function (deps) {
    'use strict';

    var request = require('request-promise');
    var loggy = require('../controllers/loggy');

    // unpack deps
    var User = deps.User;

    var logRoute = function* (next) {
        var data = this.request.body;
        if (!data || !data.actionId) {
            this.throw(400, 'Log requires at least actionId');
        }

        loggy.log(data);

        this.response.status = 200;
        this.response.body = data;

        yield next;
    };

    var userCreateRoute = function* (next) {
        var data = this.request.body;
        if (!data || !data.name || !data.email || !data.password) {
            this.throw(400, 'New user requires name, email and password properties.');
        }

        var user = yield User.create(data).catch(function (err) {});

        if (!user) {
            this.throw(406, 'Could not create user');
        }

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
        if (!logResponse) {
            /*
             even if logging fails, we still want users
             to be able to register. maybe we check & reset kafka/zookeeper on failure?
             */
        }

        this.response.status = 201;
        this.response.body = user;
    };

    var userUpdateRoute = function* (next) {
        var data = this.request.body;
        if (!data) {
            this.throw(400, 'User update requires at least email property');
        }
        // delete email field from data if it exists
        if (data.email) delete data.email;

        var user = yield User.findById(this.params.id);
        if (!user) {
            this.throw(404, 'User not found');
        }

        var updated = yield user.update(data);
        if (!updated) {
            this.throw(500, 'Failed to update user');
        }

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
        if (!logResponse) {
            /*
             even if logging fails, we still want users
             to be able to register. maybe we check & reset kafka/zookeeper on failure?
             */
        }

        this.response.status = 200;
        this.response.body = user;
    };

    return {
        logRoute: logRoute,
        userCreateRoute: userCreateRoute,
        userUpdateRoute: userUpdateRoute
    };
};
