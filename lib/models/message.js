'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    owner: String,
    orderId: {type: Schema.Types.ObjectId, ref: 'Order'},
    type: {type: String, defalut:'To Do', enum:['To Do', 'Critical', 'Note']},
    from: String,
    content: String,
    posted_on: Date
});

module.exports = mongoose.model('Message', MessageSchema);

