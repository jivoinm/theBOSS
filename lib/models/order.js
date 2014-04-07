'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//Project = mongoose.model('Project');

var OrderSchema = new Schema({
    owner: String,
    created_by: {type: Schema.Types.ObjectId, ref: 'User'},
    last_updated_by: {type: Schema.Types.ObjectId, ref: 'User'},
    last_updated_on: {type: Date, default: Date.now},
    customer: {type: Schema.Types.ObjectId, ref: 'Customer'},
    status: String,
    projects: [
        {
            project: {type: Schema.Types.ObjectId, ref: 'Project'},
            field_values: {type: Array, default: []},
            last_updated: {type: Date, default: Date.now},
            tasks: [
                {
                    title: String,
                    done: Boolean,
                    assigned_to: String
                }
            ]
        }
    ]
});


//validate customer name is not null
OrderSchema
    .path('customer')
    .validate(function (value) {

        return value;
    }, 'Customer cannot be blank.');

/**
 * Methods
 */
OrderSchema.statics.queryOrders = function (owner, query, sort, populate, cb) {
    query.owner = owner;
    this.find(query)
        .populate(populate)
        .sort(sort)
        .exec(cb);
}

OrderSchema.methods = {
    getProjectTasks: function (cb) {
        var tasks = [];
        var self = this;
        self.projects.forEach(function (item) {
            var project = item.project;//Project.findById(item.project._id).sort({}).exec();
            console.log(project);
            if (project) {
                project.tasks.forEach(function (task) {
                    console.log(task);
                });
            }
        });
        cb(tasks);
    }
}


module.exports = mongoose.model('Order', OrderSchema);