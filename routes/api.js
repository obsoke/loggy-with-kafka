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
        yield next;
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
        this.response.body = user;
    };

    var userUpdateRoute = function* (next) {
        var data = this.request.body;
        if (!data) {
            this.throw(400, 'Requires at least email property');
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

        // todo: create log request

        this.response.status = 200;
        this.response.body = user;
    };

    return {
        logRoute,
        userCreateRoute,
        userUpdateRoute
    };
};
