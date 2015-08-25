'use strict';

var koa = require('koa');
var app = koa();
var router = require('koa-router');
var bodyParser = require('koa-bodyparser');

var PORT = process.env.PORT || 3000;

// sequelize setup

// koa middleware setup
app.use(bodyParser());

// define routes
var apiRoutes = require('./routes/api');
var API = new router();
API
    .post('/log', apiRoutes.logRoute)
    .post('/classes/user', apiRoutes.userCreateRoute)
    .put('/classes/user/:id', apiRoutes.userUpdateRoute);
app
    .use(API.routes());

// listen on PORT
if (!module.parent) {
    app.listen(PORT);
    console.log('API listening at http://localhost:' + PORT);
}

// export app & port for test suite
module.exports = {
    app: app,
    port: PORT
};
