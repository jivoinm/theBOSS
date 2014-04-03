'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
    owner: String,
    customer: {type: Schema.ObjectId, ref: 'CustomerSchema'},
    projects: [
        {
            project: {type: Schema.ObjectId, ref: 'ProjectSchema'},
            field_values: {type: Array, default: []},
            last_updated: {type: Date, default: Date.now}
        }
    ],
    tasks: [
        {
            title: String,
            done: Boolean,
            assigned_to: String
        }
    ]
});

module.exports = mongoose.model('Order', OrderSchema);