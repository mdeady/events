'use strict';

var app = require('../../../server.js'),
    db = app.get('db'),
    models = app.get('models'),
    Namespace = models.Namespace,
    Identifier = models.Identifier,
    standardResponse = require('../../lib/StandardResponse'),
    _ = require('lodash'),
    Promise = require('bluebird');

function eventNameService() {
    return app.get('eventNameService');
}


function readNamespace(req, res) {

    var nsName = req.route.params.namespace,
        ns = eventNameService().read(nsName);

    if (ns === null) {
        res.send(404);
    } else {
        res.send(standardResponse({
            data : ns
        }));
    }
}

function defineNamespace(req, res) {

    var nsName = req.route.params.namespace;

    if (app.get('nameRegex').test(nsName)) {
        res.send(400, standardResponse()
            .addError('bad-name', 'Your name did not pass validation. It must be all lowercase letters - and _. No numbers.'));
        return;
    }

    eventNameService().define(nsName).spread(function(ns, created) {

        res.send(created ? 201 : 200, standardResponse({
            data : ns
        }));
    });
}

function readIdentifier(req, res) {

    var ns = req.route.params.namespace,
        id = req.route.params.identifier,
        result = eventNameService().read(ns, id);

    if (result) {
        res.send(standardResponse({
            data : result
        }))
    } else {
        res.send(404);
    }
}

module.exports = function(rootNs, app) {

    app.get(rootNs + '/:namespace', readNamespace);
    app.post(rootNs + '/:namespace', defineNamespace);
    app.get(rootNs + '/:namespace/:identifier', readIdentifier);
};
