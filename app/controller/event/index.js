'use strict';

var app = require('../../../server.js'),
    db = app.get('db'),
    modelDir = app.get('modelDir'),
    Namespace = require(modelDir + '/Namespace.js'),
    standardResponse = require('../../lib/StandardResponse');

function readNamespace(req, res) {

    Namespace.find({where : {
        name : req.route.params.namespace
    }}).success(function(ns) {

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

    app.get(rootNs+'/define/:namespace', readNamespace);
};
