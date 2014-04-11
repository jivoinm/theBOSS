'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Order = mongoose.model('Order');

exports.create = function (req, res, next) {
}
exports.update = function (req, res, next) {
}
exports.delete = function (req, res, next) {
}
exports.query = function (req, res, next) {
}
exports.loadLatest = function (req, res, next) {
    if (req.user) {
        var queryOrders = {};
        if (req.params.user_id) {
            queryOrders['created_by'] = req.params.user_id
        }
        var currentOwner = req.user.owner;
        Order.queryOrders(currentOwner, queryOrders, {
                last_updated_on: 1
            },
            'customer'
            , function (err, orders) {
                if (!err) {
                    console.log(orders);
                    return res.json(orders);
                } else {
                    console.log(err);
                    return res.send(err);
                }
            });
    }
    return  res.json({error: 'No user is logged in yet!!!'});
}