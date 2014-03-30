'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OwnerSchema = new Schema({
    name: String,
    created:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Owner', OwnerSchema);

