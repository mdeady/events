'use strict';

var app = require('../../../server.js'),
    db = app.get('db'),
    models = app.get('models'),
    Namespace = models.Namespace,
    Identifier = models.Identifier,
    standardResponse = require('../../lib/StandardResponse'),
    _ = require('lodash');

function getNamespace(name) {

    return db.query("select ns.name as namespace, " +
        "id.name as identifier " +
        "from namespace ns " +
        "left join identifier id " +
        "on id.namespace_id = ns.id " +
        "where ns.name = ?", null, {raw : true}, [name])
        .then(function(nsIds) {

            if (nsIds && nsIds.length > 0) {

                return nsIds.reduce(function(ns, nsId) {

                    ns.namespace = nsId.namespace;
                    if (nsId.identifier) {

                        ns.identifiers.push(nsId.identifier);
                    }
                    return ns;
                }, {namespace : null, identifiers : []});
            } else {
                return null;
            }
        });
}

function readNamespace(req, res) {

    var nsName = req.route.params.namespace;
    getNamespace(nsName).then(function(ns) {

        if (ns === null) {
            res.send(404);
        } else {
            res.send(standardResponse({
                data : ns
            }));
        }
    });
}

function createNamespace(name) {

    return db.query('insert into namespace (name) values (?)',
        null, {raw : true}, [name]);
}

function defineNamespace(req, res) {

    var nsName = req.route.params.namespace;

    if (app.get('nameRegex').test(nsName)) {
        res.send(400, standardResponse()
            .addError('bad-name', 'Your name did not pass validation. It must be all lowercase letters - and _. No numbers.'));
        return;
    }

    getNamespace(nsName).then(function(ns) {

        console.log(ns);
        if (!ns || ns.length === 0) {
            createNamespace(nsName).success(function() {

                getNamespace(nsName).then(function(ns) {

                    res.send(201, standardResponse({
                        data : ns
                    }));
                })
            });
        } else {
            res.send(200, standardResponse({
                data : ns
            }));
        }
    })
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

    app.get(rootNs + '/:namespace', readNamespace);
    app.post(rootNs + '/:namespace', defineNamespace);
    app.get(rootNs + '/:namespace/:identifier', readIdentifier);
};
