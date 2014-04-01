'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    owner: String,
    name: String,
    fields: [
        {
            field_order: Number,
            field_title: String,
            field_type: String,
            field_value: String,
            field_require: Boolean,
            field_options: {type: Array, default: []}
        }
    ],
    tasks: [
        {
            task_order: Number,
            task_title: String,
            task_duration: String
        }
    ]
});

//validate name not already exists
ProjectSchema
    .path('name')
    .validate(function (value, respond) {
        var self = this;
        var test = {name: value, owner: self.owner};
        this.constructor.findOne(test, function (err, project) {
            if (err) throw err;
            if (project) {
                if (self.id === project.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified project name is already exist on the same owner.');

module.exports = mongoose.model('Project', ProjectSchema);

