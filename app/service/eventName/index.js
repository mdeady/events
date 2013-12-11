'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    service = {
        read   : function(ns, id) {

            var namespace = service.all[ns];
            if (!namespace) {
                return null;
            }
            if (id) {
                if (namespace.identifiers[id]) {

                    return _.assign({}, namespace.identifiers[id]);
                } else {
                    return null;
                }
            } else {
                var result = _.assign({}, namespace);
                result.identifiers = Object.keys(result.identifiers);
                return result;
            }
        },
        define : function(ns, id) {

            var existing = service.read(ns, id);

            if (existing) {
                return Promise.fulfilled([
                    existing,
                    false
                ]);
            } else if (!id) {

                var deferred = Promise.defer();
                db.query('insert into namespace (name) values (?)', null, {raw : true}, [ns])
                    .then(function() {

                        return update();
                    })
                    .then(function() {

                        deferred.resolve([
                            service.read(ns),
                            true
                        ]);
                    });

                return deferred.promise;
            }
        }
    },
    app,
    db;

function update() {

    return db.query('select ns.id as namespace_id, ' +
            'id.id as identifier_id, ' +
            'ns.name as namespace, ' +
            'id.name as identifier ' +
            'from namespace ns ' +
            'left join identifier id ' +
            'on id.namespace_id = ns.id')
        .success(function(eventNames) {

            service.all = eventNames.reduce(function(all, eventName) {

                var ns = eventName.namespace,
                    id = eventName.identifier;

                all[ns] = all[ns] || {
                    namespace_id : eventName.namespace_id,
                    namespace    : eventName.namespace,
                    identifiers  : {}
                };

                if (id) {
                    all[ns].identifiers[id] = eventName;
                }
                return all;
            }, {});

            return service.all;
        });
}

module.exports = function(appRef) {

    if (!app) {
        app = appRef;
        db = app.get('db');
        update();
    }

    return service;
};
