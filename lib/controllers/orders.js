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

function QueryOrders(queryOrders, sort, limit, res) {
    Order.queryOrders(queryOrders,
            sort|| {last_updated_on: -1},
            'created_by customer total_working_hours',
            limit ||  10)

        .addBack(function (err, orders) {
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
            owner: req.user.owner,
            created_by: req.params.id
        };
        QueryOrders(queryOrders, null,10, res);
    }
};

exports.loadLatest = function (req, res) {
    if (req.user) {
        var queryOrders = {
            owner: req.user.owner
        };

        QueryOrders(queryOrders, {last_updated_on:-1},50, res);
    }
}

exports.unscheduled = function (req, res) {
    Order.find({
        owner: req.user.owner,
        scheduled: false
    })
        .populate('customer created_by')
        .sort({date_required: -1})
        .exec(function (err, orders){
            if(err) res.json(400,err);
            return res.send(orders);
        });
}

exports.partialUpdate = function (req, res){
    console.log('partialUPDATE',req.params);
    Order.update({ _id: req.params.id, owner: req.user.owner},
        {$set: {scheduled: req.params.scheduled}},
        function (err, order){
            if(err) res.json(400,err);
            return res.json(order);
        });
}

exports.createOrder = function(req,res){

    function SaveOrder(order) {
        Order.create(order,function (err, order) {
            if (err) return res.send(err);
            return res.json(order);
        })
    }

    if(req.user){
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
            findOrCreateNewCustomer(req.body.customer, function(err,cust){
                if (err) return res.send(err);
                order.customer = cust._id;
                SaveOrder(order)
            })

        }
    }
}

exports.updateOrder = function(req,res){
    if(req.user){
        var id = req.body._id;
        var order = req.body;
        delete order._id;
        findOrCreateNewCustomer(order.customer,function(err,cust){
            if (err) return res.send(err);
            order.customer = cust._id;
            delete order.created_by;
            order.last_update_by = req.user._id;
            order.last_updated = new Date();

            Order.update({_id:id},order,function(err){
                if(err) return res.send(err);
                return res.json({message:'Order was updated with success'});
            })
        })

    }
}

function findOrCreateNewCustomer(customer,done){
    return Customer.findOne(customer,function(err, cust){
        if(err) done(err);
        if(!cust){
            //create new customer
            Customer.create(customer,function(err,cust){
                if(!err){
                    if(err) done(err);
                    return done(err,cust);
                }
            });
        }else{
            return done(err,cust);
        }
    });
}