'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerFormSchema = new Schema({
    name: String,
    owner: String,
    last_updated_by: {type: Schema.Types.ObjectId, ref: 'User'},
    last_updated_on: {type: Date, default: Date.now},
    is_active: {type: Boolean, default: true},
    is_deleted: {type: Boolean, default: false},
    forms: [
        {
            form_name: String,
            fields:{type: Array, default: []}
        }
     ],
    
});

module.exports = mongoose.model('CustomerForm', CustomerFormSchema);