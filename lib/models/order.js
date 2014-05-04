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
            project: String,
            field_sets:{type: Array, default: []},
            tasks: {type: Array, default: []}
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