'use strict';

var express = require('express'),
    Sequelize = require('sequelize'),
    db = new Sequelize('events', 'postgres', 'pwd', {
        dialect : 'postgres'
    });


var app = express();

module.exports = app;

app.set('db', db);

app.set('rootDir', __dirname);
app.set('ctrlDir', app.get('rootDir') + '/app/controller');
app.set('modelDir', app.get('rootDir') + '/app/model');

// Regex used everywhere for validating names.
// if (app.get('nameRegex').test(name)) { /* name is invalid */ }
app.set('nameRegex', /[^-_a-z]|^.{0,2}$/);

app.use(app.router);


require('./config/routing.js')(app);

app.listen(3000);
