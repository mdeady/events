'use strict';

var Sequelize = require('sequelize'),
    app = require('../../server.js'),
    db = new Sequelize('events', 'postgres', 'pwd', {
        dialect : 'postgres'
    });

app.set('db', db);

var models = [
    'Namespace',
    'Identifier'
];

models.forEach(function(model) {
    module.exports[model] = db.import(__dirname + '/' + model);
});

(function(xp) {
    'use strict';

    xp.Namespace.hasMany(xp.Identifier);

    xp.Identifier.hasOne(xp.Namespace, {
        foreignKey : 'namespace_id'
    });

})(module.exports);
