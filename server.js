'use strict';

var express = require('express'),

    app = express();

module.exports = app;

app.set('rootDir', __dirname);
app.set('ctrlDir', app.get('rootDir') + '/app/controller');
app.set('models', require('./app/model/index.js'));

// Regex used everywhere for validating names.
// if (app.get('nameRegex').test(name)) { /* name is invalid */ }
app.set('nameRegex', /[^-_a-z]|^.{0,2}$/);

app.use(app.router);


require('./app/controller')('/event', app);
require('./app/service')(app);

app.listen(3000);
