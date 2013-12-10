'use strict';

var app = require('../../../server.js'),
    db = app.get('db'),
    models = app.get('models'),
    Namespace = models.Namespace,
    Identifier = models.Identifier,
    standardResponse = require('../../lib/StandardResponse');

function readNamespace(req, res) {

    Namespace.find({
        where   : {
            name : req.route.params.namespace
        },
        include : [Identifier]
    }).success(function(ns) {

            if (ns) {
                res.send(standardResponse({
                    data : ns
                }));
            } else {
                res.status(404).send('');
            }
        });
}

module.exports = function(rootNs, app) {

    app.get(rootNs + '/define/:namespace', readNamespace);
};
