'use strict';

var express = require('express'),
    Sequelize = require('sequelize'),
    db = new Sequelize('events', 'postgres', 'pwd', {
        dialect : 'postgres'
    });


var app = express();

module.exports = app;

app.set('db', db);

app.use(app.router);


require('./config/routing.js')(app);

app.listen(3000);
