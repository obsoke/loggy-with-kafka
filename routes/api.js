'use strict';

var logRoute = function* (next) {
    /* create log request from data.
     it shoud look like:
     { actionId [, userId] [, data] }
    */
    this.body = { success: true };
};

var userCreateRoute = function* (next) {
    // user created
    this.response.status = 201;
    this.response.body = {
        success: true,
        data: {}
    };
};

var userUpdateRoute = function* (next) {
};

module.exports = {
    logRoute,
    userCreateRoute,
    userUpdateRoute
};
