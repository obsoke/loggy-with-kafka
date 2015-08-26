module.exports = function (deps) {
    'use strict';

    // unpack deps
    var User = deps.User;

    var logRoute = function* (next) {
        /* create log request from data.
         it shoud look like:
         { actionId [, userId] [, data] }
         */
        this.body = { success: true };
    };

    var userCreateRoute = function* (next) {
        var data = this.request.body;
        if (!data || !data.name || !data.email || !data.password) {
            this.throw(400, 'Requires name, email and password properties.');
        }

        var user = yield User.create(data).catch(function (err) {});

        if (!user) {
            this.throw(406, 'Could not create user');
        }

        // todo: create log request

        this.response.status = 201;
        this.response.body = {
            success: true,
            data: user
        };
    };

    var userUpdateRoute = function* (next) {
    };

    return {
        logRoute,
        userCreateRoute,
        userUpdateRoute
    };
};
