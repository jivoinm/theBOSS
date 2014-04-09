'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
                    status: String,
                    done: Boolean,
                    assigned_to: String
                }
            ]
        }
    ]
});

// specify the transform schema option
if (!OrderSchema.options.toObject) OrderSchema.options.toObject = {};
OrderSchema.options.toObject.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    delete ret._id;
}

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
        .lean()
        .populate(populate)
        .sort(sort)
        .exec(cb);
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns {} a new object based on obj1 and obj2
 */
function merge_options(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        if (attrname.indexOf('_') > -1) continue;
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        if (attrname.indexOf('_') > -1) continue;
        obj3[attrname] = obj2[attrname];
    }

    return obj3;
}


OrderSchema.methods = {
    getProjectTasks: function (cb) {
        var tasks = [];
        var self = this;
        var select = [
            {
                path: 'project',
                model: 'Project'
            }
        ];

        self.constructor.populate(self.projects, select, function (err, projects) {
            projects.toObject().forEach(function (proj) {
                var project_tasks = proj.project.tasks.sort(function (a, b) {
                    if (a.priority > b.priority)
                        return 1;
                    if (a.priority < b.priority)
                        return -1;
                    return 0;
                });
                tasks.push(project_tasks.map(function (task) {
                    var existing_task = proj.tasks.filter(function (element) {
                        return element.title === task.title;
                    });

                    return merge_options(task, existing_task.length > 0 ? existing_task[0] : {});
                }));
            });
            cb(tasks);
        });
    }
}


module.exports = mongoose.model('Order', OrderSchema);