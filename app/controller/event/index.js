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
    db.query("select * from namespace where name = ?", null, {raw : true}, [nsName])
        .success(function(ns) {

            if (ns && ns.length > 0) {
                ns = ns[0];
                db.query('select name from identifier where id = ?', null, {raw : true}, [ns.id])
                    .success(function(identifiers) {

                        ns.identifiers = _.map(identifiers, 'name');
                        res.send(standardResponse({
                            data : ns
                        }));
                    });
            } else {
                res.send(404);
            }
        });
}

function readIdentifier(req, res) {

    var ns = req.route.params.namespace,
        id = req.route.params.identifier;

    db.query('select id.* ' +
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
