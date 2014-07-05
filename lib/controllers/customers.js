'use strict';

var mongoose = require('mongoose'),
    Customer = mongoose.model('Customer');

exports.queryByName = function(req, res){
    Customer.find({
        owner: req.user.owner,
        name: new RegExp(req.query.name,'i')
    }).limit(10).exec(function(err, customers){
        if(err) res.json(400,err);
        return res.send(customers);
    });
}
