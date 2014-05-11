'use strict';

var mongoose = require('mongoose'),
    Calendar = mongoose.model('Calendar');

exports.getCalendar = function (req, res) {
    var from = req.params.from;
    var to = req.params.to;
    Calendar.find({
        owner: req.user.owner,
        start: {$gte: from, $lte:to}
    }, function(err, calendarEvents){
        if(err) res.json(400,err);
        return res.send(calendarEvents);
    })
}

exports.createCalendar = function (req, res) {
    console.log('crateCalendar ',req.body);
    Calendar.create(req.body, function (err, calendar){
        if(err) res.json(400,err);
        return res.send(calendar);
    })
}

exports.updateCalendar = function (req, res) {
    console.log('updateCalendar', req.body);
    delete req.body._id;
    Calendar.findByIdAndUpdate(req.params.id, req.body, function (err, calendar){
        if(err) res.json(400,err);
        return res.send(calendar);
    })
}

exports.deleteCalendar = function (req, res) {
    Calendar.findByIdAndRemove(req.body._id, function (err, calendar){
        if(err) res.json(400,err);
        return res.send(calendar);
    })
}
