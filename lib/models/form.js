'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FieldSchema = new Schema({
    order: Number,
    title: String,
    type: String,
    value: String,
    require: Boolean,
    show_options: String
});


var FormSchema = new Schema({
    owner: String,
    form_name: String,
    module: String,
    fields: [FieldSchema],

    tasks: [
        {
            priority: Number,
            title: String,
            duration: String,
            status_options: String
        }
    ]
    },
    { autoIndex: false });


var self = this;
FormSchema
    .path('form_name')
    .validate(function (form_name) {
        return form_name.length;
    }, 'The specified project name cannot be blank.');

//validate name not already exists
FormSchema
    .path('form_name')
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
module.exports = mongoose.model('Field', FieldSchema);

