'use strict';

var mongoose = require('mongoose'),
    CustomerForm = mongoose.model('CustomerForm');

exports.get = function (req, res) {
    CustomerForm.findOne({
        _id: req.params.id,
        owner: req.user.owner
    }, function(err, customerForm){
        if (err) return res.json(400, err);
        return res.send(customerForm);
    })
}

exports.getAll = function (req, res) {
    CustomerForm.find({
        owner: req.user.owner
    }, function(err, customerForms){
        if (err) return res.json(400, err);
        return res.send(customerForms);
    })
}