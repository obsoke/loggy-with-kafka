module.exports = function(deps) {
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

    // User.sync({force: true}).then(function () {
    //     return User.create({
    //         name: 'dale',
    //         email: 'dale@dale.io',
    //         password: '12345'
    //     });
    // });

    return User;
};
