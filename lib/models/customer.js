'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema({
    owner: String,
    name: String,
    address: String,
    postal_code: String,
    province: String,
    country: String,
    email: String,
    phone: String,
    cell: String
});

module.exports = mongoose.model('Customer', CustomerSchema);
