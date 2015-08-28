module.exports = function (deps) {
    'use strict';

    // unpack deps
    var sequelize = deps.sequelize,
        Sequelize = deps.Sequelize;

    // define user model
    var User = sequelize.define('user', {
        // attributes
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        // options
        freezeTableName: true
    });

    User.beforeUpdate(function (user, options, fn) {
        if (user._changed.email) {
            user.set('email', user.previous('email'));
        }

        return fn();
    });

    // make sure table exists
    User.sync();

    return User;
};
