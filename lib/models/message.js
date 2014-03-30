'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    user: String,
    type: String,
    from: String,
    content: String,
    time: Date
});

module.exports = mongoose.model('Message', MessageSchema);

