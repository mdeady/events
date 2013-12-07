'use strict';

module.exports = function(app) {

    var ctrlDir = '../app/controller/';
    require(ctrlDir + 'event')('/event', app);

};
