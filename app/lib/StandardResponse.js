'use strict';

var _ = require('lodash');

function StandardResponse(config) {

    this.success = config.hasOwnProperty('success')
        && config.success
        || true;

    this.data = config.hasOwnProperty('data')
        && config.data
        || null;

    this.errors = {};
    this.warnings = {};
}

StandardResponse.prototype = {
    setSuccess : function(success) {

        this.success = Object.keys(this.errors).length == 0 && success;
    },
    addError : function(key, error) {

        if (!this.errors.hasOwnProperty(key)) {
            this.errors[key] = [];
        }
        this.errors[key].push(error);
        this.success = false;
    },
    addWarning : function(key, warning) {

        if (!this.warnings.hasOwnProperty(key)) {
            this.warnings[key] = [];
        }
        this.warnings[key].push(warning);
    }
};

module.exports = function(config) {

    return new StandardResponse(config || {});
};
