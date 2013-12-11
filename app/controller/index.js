'use strict';

var fs = require('fs');

module.exports = function(rootPath, app) {

    fs.readdirSync(__dirname).forEach(function(controller) {

        var path = __dirname + '/' + controller;
        if (fs.statSync(path).isDirectory()) {

            require(path)(rootPath + '/' + controller, app);
        }
    });
};
