'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    owner: String,
    regards_to: String,
    type: String,
    from: String,
    content: String,
    posted_on: Date
});

module.exports = mongoose.model('Message', MessageSchema);

