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
exports.loadOrder = function (req, res) {
    if(req.user && req.params.id){
        Order.findOne({
                _id: req.params.id,
                owner: req.user.owner
            }).
            populate('customer','name').
            populate('created_by','name').
            exec(function (err, order) {
                if (err) res.send(err);
                if(!order) res.json({error: 'This order does not exists'});
                return res.json(order);
            });
    }

};

exports.loadOrderProjectFields = function(req,res){
    if(req.user && req.params.id){
        Order.findOne({
                _id: req.params.id,
                owner: req.user.owner}
            , function (err, order) {
                if (err) res.send(err);
                if(!order) res.json({error: 'This order does not exists'});

                order.getProjects(function(projects){
                    return res.json(projects);
                })

            });
    }

};

exports.loadOrderProjectTasks = function(req,res){
    if(req.user && req.params.id){
        Order.findOne({
                _id: req.params.id,
                owner: req.user.owner}
            , function (err, order) {
                if (err) res.send(err);
                if(!order) res.json({error: 'This order does not exists'});
                order.getProjectTasks(function(tasks){
                    return res.json(tasks);
                })

            });
    }

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
        QueryOrders(currentOwner, queryOrders, res);
    }
};

exports.loadLatest = function (req, res) {
    if (req.user) {
        var currentOwner = req.user.owner;
        QueryOrders(currentOwner, {}, res);
    }

}