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

function define(req, res) {

    var ns = req.route.params.namespace,
        id = req.route.params.identifier;

    if (app.get('nameRegex').test(ns)) {
        res.send(400, standardResponse()
            .addError('bad-name', 'Your name did not pass validation. It must be all lowercase letters - and _. No numbers.'));
        return;
    }

    eventNameService().define(ns, id).spread(
        function(newThing, created) {

            res.send(created ? 201 : 200, standardResponse({
                data : newThing
            }));
        },
        function(error) {
            error = error.split('\n');
            res.send(400, standardResponse().addError(error[0], error[1]));
        });
}

function read(req, res) {

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

    app.get(rootNs + '/:namespace/:identifier?', read);

    app.post(rootNs + '/:namespace/:identifier?', define);
};
