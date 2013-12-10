'use strict';

var app = require('../../server.js'),
    Sequelize = require('sequelize'),
    db = app.get('db'),
    Namespace;

Namespace = db.define('Namespace', {
    id   : {
        type          : Sequelize.INTEGER,
        primaryKey    : true,
        autoIncrement : true
    },
    name : {
        type      : Sequelize.STRING,
        allowNull : false,
        set       : function(name) {

            return this.setDataValue('name', name.toString().toLowerCase());
        },
        validate  : {
            is : ['[-_a-z]']
        }
    }
}, {
    freezeTableName : true,
    tableName       : 'namespace',
    timestamps      : false
});

module.exports = Namespace;
