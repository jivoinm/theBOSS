'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var fieldSchema = new Schema({
    order: Number,
    title: String,
    type: String,
    default_value: String,
    require: Boolean,
    show_options: {type: Array, default: []}
});

var FormSchema = new Schema({
    owner: String,
    name: String,
    field_sets:[
        {
            title: String,
            show_options: {type: Array, default: []},
            fields: [fieldSchema]
        }
    ],

    tasks: [
        {
            priority: Number,
            title: String,
            duration: String,
            status_options: {type: Array, default: []}
        }
    ]
}, { autoIndex: false });


var self = this;
FormSchema
    .path('name')
    .validate(function (name) {
        return name.length;
    }, 'The specified project name cannot be blank.');

//validate name not already exists
FormSchema
    .path('name')
    .validate(function (value, respond) {
        var self = this;
        var test = {name: value, owner: self.owner};
        this.constructor.findOne(test, function (err, project) {
            if (err) throw err;
            if (project) {
                if (self._id === project._id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified project name is already exist on the same owner.');

/**
 * Methods
 */
FormSchema.statics.findOwnerProjects = function (ownerName, cb) {
    this.find({owner: ownerName}, cb);
}

module.exports = mongoose.model('Form', FormSchema);

