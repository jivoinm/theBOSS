'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    owner: String,
    name: String,
    bill_to: String,
    ship_to: String,
    email: String,
    phone: String,
    cell: String,
    is_private: { type:Boolean, default:true }
});

module.exports = mongoose.model('Customer', CustomerSchema);
