'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CalendarSchema = new Schema({
    owner: String,
    title: String,
    details: String,
    url: String,
    color: String,
    start: Date,
    end: Date,
    allDay: Boolean
});

module.exports = mongoose.model('Calendar', CalendarSchema);