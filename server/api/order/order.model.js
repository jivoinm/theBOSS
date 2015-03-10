'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrderSchema = new Schema({
    owner: String,
    createdBy: {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        name: String,
        email: String
    },
    doors: String,
    createdOn: {type: Date, default: Date.now},
    lastUpdatedBy: {
        user_id: {type: Schema.Types.ObjectId, ref: 'User'},
        name: String,
        email: String
    },
    lastUpdatedOn: {type: Date, default: Date.now},
    customer: {
        name: String,
        bill_to: String,
        ship_to: String,
        email: String,
        phone: String,
        cell: String,
        is_private: { type:Boolean, default:true }
    },
    status: String,
    poNumber: String,
    dateRequired: Date,
    installationDate: Date,
    shippedDate: Date,

    forms: [
        {
            formName: String,
            fields: {type: Array, default: []},
            tasks: {type: Array, default: []}
        }
    ],
    orderedAccessories:[{
        fromManufacturer: String,
        description: String,
        quantity: Number,
        itemsReceived: Number,
        received: {type: Boolean, default: false},
        dateReceived: Date,
        received_by: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    services:[{
        date: Date,
        details: String,
        doneBy: { type: Schema.Types.ObjectId, ref: 'User' },
        completed: {type: Boolean, default: false}
    }],

    uploadedFiles: {type: Array, default: []}
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
    findExec.select('customer.name poNumber createdBy.name createdOn dateRequired status');
    return findExec.exec();
};

module.exports = mongoose.model('Order', OrderSchema);
