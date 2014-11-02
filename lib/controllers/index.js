'use strict';

var path = require('path');
var mongoose = require('mongoose');

/**
 * Send partial, or 404 if it doesn't exist
 */
exports.partials = function (req, res) {
    var stripped = req.url.split('.')[0];
    var requestedView = path.join('./', stripped);
    res.render(requestedView, function (err, html) {
        if (err) {
            res.status(404);
            res.send(404);
        } else {
            res.send(html);
        }
    });
};

/**
 * Send our single page app
 */
exports.index = function (req, res) {
    res.render('index');
};


exports.modelToJson = function(req, res){
    var model = req.params.model;
    var schema = mongoose.model(model);
    res.json(new Sschema().schema);
};