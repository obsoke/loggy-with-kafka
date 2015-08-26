'use strict';

var koa = require('koa');
var app = koa();
var router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var Sequelize = require('sequelize');

var PORT = process.env.PORT || 3000;
var postgresURL = 'postgres://pumpup:pumpup@localhost:5432/pumpup_db';

// sequelize setup
var sequelize = new Sequelize(postgresURL);

// koa middleware setup
app.use(bodyParser());

// define models
var User = require('./models/user')({sequelize, Sequelize});

// define routes
var apiRoutes = require('./routes/api')({User});
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
    app,
    port: PORT,
    User
};
