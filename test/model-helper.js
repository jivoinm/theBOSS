'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('User'),

    Message = mongoose.model('Message'),
    Form = mongoose.model('Form'),
    Order = mongoose.model('Order'),
    Calendar = mongoose.model('Calendar'),
    Customer = mongoose.model('Customer');

var helper = function(ownerName, prefix, nrOfOrders){
    console.log(ownerName, prefix, nrOfOrders);
    if(!ownerName) {
        throw "No owner is set";
    }
    var addUser = function(userName){
        return User.create({
            name: userName,
            owner: ownerName,
            password: 'test'
        });
    };

    var addCustomer = function (name, bill_to, ship_to, email,phone,cell, isPrivate){
        return Customer.create({
            name: name,
            owner: ownerName,
            bill_to: bill_to,
            ship_to: ship_to,
            email: email,
            phone: phone,
            cell: cell,
            is_private: isPrivate
        });
    }

    var addOrder = function(user, customer, projects, services){
        return Order.create({
            created_by: user,
            customer: customer,
            projects: projects,
            services: services
        });
    }

    this.addOneOrder = function(userName,customerName, done){
        addUser(userName)
            .then(function(user){
                addCustomer(customerName)
                    .then(function(customer){
                        addOrder(user,customer)
                            .then(function(order){
                                done(order);
                            })

                    })
            });
    }

}



module.exports = helper;


