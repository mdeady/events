'use strict';

var app = require('../../../server.js'),
    db = app.get('db'),
    models = app.get('models'),
    Namespace = models.Namespace,
    Identifier = models.Identifier,
    standardResponse = require('../../lib/StandardResponse'),
    _ = require('lodash');

function readNamespace(req, res) {

    var nsName = req.route.params.namespace;
    db.query("select ns.name as namespace, " +
        "id.name as identifier " +
        "from namespace ns " +
        "join identifier id " +
        "on id.namespace_id = ns.id " +
        "where ns.name = ?", null, {raw : true}, [nsName])
        .success(function(namespaceIdentifiers) {

            if (namespaceIdentifiers && namespaceIdentifiers.length > 0) {
                var namespace = namespaceIdentifiers.reduce(function(ns, nsId) {

                    ns.namespace = nsId.namespace;
                    ns.identifiers.push(nsId.identifier);
                    return ns;
                }, {namespace : null, identifiers : []});
                res.send(standardResponse({
                    data : namespace
                }))
            } else {
                res.send(404);
            }
        });
}

function readIdentifier(req, res) {

    var ns = req.route.params.namespace,
        id = req.route.params.identifier;

    db.query('select ns.name as namespace, id.name as identifier ' +
        'from identifier id ' +
        'join namespace ns ' +
        'on ns.id = id.namespace_id ' +
        'where ns.name = ? ' +
        'and id.name = ?', null, {raw : true}, [ns, id])
        .success(function(result) {

            if (result && result.length > 0) {
                res.send(standardResponse({
                    data : result[0]
                }))
            } else {
                res.send(404);
            }
        });
}

module.exports = function(rootNs, app) {

    app.get(rootNs + '/define/:namespace', readNamespace);
    app.get(rootNs + '/define/:namespace/:identifier', readIdentifier);
};
