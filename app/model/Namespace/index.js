'use strict';

module.exports = function(db, DataTypes) {

    return db.define('Namespace', {
        id   : {
            type          : DataTypes.INTEGER,
            primaryKey    : true,
            autoIncrement : true
        },
        name : {
            type      : DataTypes.STRING,
            allowNull : false,
            validate  : {
                is : ['[-_a-z]']
            }
        }
    }, {
        freezeTableName : true,
        tableName       : 'namespace',
        timestamps      : false,
        underscored     : true
    });
};
