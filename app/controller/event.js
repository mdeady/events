'use strict';

var app = require('../../server.js'),
    db = app.get('db');

module.exports = function(rootNs, app) {

    app.get(rootNs + '/list', function(req, res) {

        db.query('select * from namespace').success(function(data) {

            res.send(data);
        });
    });
};
