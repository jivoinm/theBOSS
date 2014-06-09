'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
    owner: String,
    scheduled: {type: Boolean, default: false},
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    last_updated_by: {type: Schema.Types.ObjectId, ref: 'User'},
    last_updated_on: {type: Date, default: Date.now},
    customer: {type: Schema.Types.ObjectId, ref: 'Customer'},
    status: String,
    po_number: String,
    date_required: Date,

    forms: [
        {
            form_name: String,
            fields:{type: Array, default: []},
            tasks: {type: Array, default: []}
        }
    ],
    ordered_accessories:[{
        from_manufacturer: String,
        description: String,
        quantity: Number,
        received: { type: Boolean, default: false },
        date_received: Date,
        received_by: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    services:[{
        date: Date,
        details: String,
        done_by: { type: Schema.Types.ObjectId, ref: 'User' }
    }],

    uploaded_files: {type: Array, default: []}
});

// specify the transform schema option
if (!OrderSchema.options.toObject) OrderSchema.options.toObject = {};
if (!OrderSchema.options.toJSON) OrderSchema.options.toJSON = {};
OrderSchema.options.toObject = {
    virtuals: true
};
OrderSchema.options.toJSON = {
    virtuals: true
};

//OrderSchema.options.toObject.transform = function (doc, ret, options) {
//    // remove the _id of every document before returning the result
//    delete ret._id;
//}

//validate customer name is not null
OrderSchema
    .path('customer')
    .validate(function (value) {

        return value;
    }, 'Customer cannot be blank.');


OrderSchema
    .virtual('total_working_hours')
    .get(function () {

        var hours = 0;
        if(this.forms){
            this.forms.forEach(function(project){
                if(project.tasks){
                    project.tasks.forEach(function(task){
                        hours += +task.duration.replace(/h$/,"");
                    })
                }
            })
        }
        return hours;
    });
/**
 * Methods
 */

OrderSchema.statics.queryOrders = function (query, sort, populate,limit) {

    var findExec = this.find(query).lean();
    if(populate)
        findExec.populate(populate);
    if(limit)
        findExec.limit(limit);
    if(sort)
        findExec.sort(sort);

    return findExec.exec();
}

module.exports = mongoose.model('Order', OrderSchema);