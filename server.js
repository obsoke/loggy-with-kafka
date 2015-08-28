'use strict';

var koa = require('koa'),
    app = koa(),
    router = require('koa-router'),
    bodyParser = require('koa-bodyparser'),
    Sequelize = require('sequelize');

var config = require('./config'),
    PORT = process.env.PORT || config.port || 3000;

// sequelize setup
var sequelize = new Sequelize(config.postgresURL);

// koa middleware setup
app.use(bodyParser());

// define models
var User = require('./models/user')({sequelize: sequelize, Sequelize: Sequelize});

// define routes
// would put them in their own files depending on function
// but with a project this size, no point
var apiRoutes = require('./routes/api')({User: User});
var API = new router();
API
    .post('/log', apiRoutes.logRoute)
    .post('/classes/user', apiRoutes.userCreateRoute)
    .put('/classes/user/:id', apiRoutes.userUpdateRoute);
app
    .use(API.routes());
// 404 route is given to us for free by koa
// on any non-defined route

// listen on PORT
if (!module.parent) {
    app.listen(PORT);
    console.log('API listening at http://localhost:' + PORT);
}

// export app & port for test suite
module.exports = {
    app: app,
    User: User
};
