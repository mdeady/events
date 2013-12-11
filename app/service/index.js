'use strict';

var fs = require('fs');

module.exports = function(app) {

    fs.readdirSync(__dirname).forEach(function(service) {

        var path = __dirname + '/' + service;
        if (fs.statSync(path).isDirectory()) {

            app.set(service + 'Service', require(path)(app));
        }
    })
};
