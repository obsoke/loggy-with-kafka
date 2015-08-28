module.exports = function (deps) {
    'use strict';

    // unpack deps
    var sequelize = deps.sequelize,
        Sequelize = deps.Sequelize;

    // define user model
    var User = sequelize.define('user', {
        // attributes
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        }
    }, {
        // options
        freezeTableName: true
    });

    // make sure table exists
    User.sync();

    return User;
};
