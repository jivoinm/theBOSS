'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Form'),
    Customer = mongoose.model('Customer'),
    Order = mongoose.model('Order');

exports.delete = function (req, res, next) {
};
exports.query = function (req, res, next) {
};
exports.loadOrder = function (req, res) {
    if(req.user && req.params.id){
        console.log('loadOrder '+req.params.id);
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
                return res.json(order.projects)
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
                return res.json(order.tasks);

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

exports.createOrder = function(req,res){

    function SaveOrder(order) {
        Order.create(order,function (err, order) {
            if (err) return res.send(err);
            return res.json(order);
        })
    }

    if(req.user){
        console.log(req.body);

        var currentUser = req.user;
        var currentOwner = req.user.owner;
        var order = req.body;
        order.created_by = currentUser._id;
        order.owner = currentOwner;
        //check if the customer id is set and use that
        if(req.body.customer._id){
            order.cusomer = req.body.customer._id;
            //update customer details...
            SaveOrder(order);
        }else{
            Customer.findOne(req.body.customer,function(err,customer){
                if(!customer){
                        req.body.customer.owner = currentOwner;
                        Customer.create(req.body.customer,function(err,customer){
                            if(!err){
                                order.customer = customer._id;
                                SaveOrder(order);
                            }
                        });
                }else{
                    order.customer = customer;
                    SaveOrder(order);
                }

            });
        }

    }
}

exports.updateOrder = function(req,res){
    if(req.user){
        var id = req.body._id;
        var order = req.body;
        delete order._id;

        Order.update({_id:id},order,function(err){
            console.log(err);
            if(err) return res.send(err);
            return res.json({message:'Order was updated with success'});
        })
    }
}