'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Order = mongoose.model('Order');

exports.create = function (req, res, next) {
};
exports.update = function (req, res, next) {
};
exports.delete = function (req, res, next) {
};
exports.query = function (req, res, next) {
};

function QueryOrders(currentOwner, queryOrders, res) {
    Order.queryOrders(currentOwner, queryOrders, {
            last_updated_on: 1
        },
        'customer'
        , function (err, orders) {
            if (!err) {
                return res.json(orders);
            } else {
                return res.send(err);
            }
        });
}
exports.loadUserLatest = function (req, res) {
    if (req.user) {
        var queryOrders = {
            created_by: req.params.id
        };
        var currentOwner = req.user.owner;
        console.log(queryOrders);
        QueryOrders(currentOwner, queryOrders, res);
    }
};

exports.loadLatest = function (req, res) {
    if (req.user) {
        var currentOwner = req.user.owner;
        QueryOrders(currentOwner, {}, res);
    }

}