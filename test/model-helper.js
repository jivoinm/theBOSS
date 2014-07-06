'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('User'),

    Message = mongoose.model('Message'),
    Form = mongoose.model('Form'),
    Order = mongoose.model('Order'),
    Calendar = mongoose.model('Calendar');

var helper = function(ownerName){
    console.log(ownerName, prefix, nrOfOrders);
    if(!ownerName) {
        throw "No owner is set";
    }
    var clearAll = function(done){
        User.find({}).remove(function(){
            Order.find({}).remove(function(){
                Calendar.find({}).remove(function(){
                    Form.find({}).remove(function(){
                        Message.find({}).remove(function(){
                            done();
                        });
                    })
                })
            })
        })
    }
    
    var addUser = function(userName){
        return User.create({
            name: userName,
            owner: ownerName,
            password: 'test'
        });
    }

    var addForm = function(module, name, fields, tasks){
        return  Form.create({
            module: module,
            owner: ownerName,
            form_name:name,
            fields: fields,
            tasks: tasks
        });
    }
    
    var setCustomer = function (name, bill_to, ship_to, email,phone,cell, isPrivate){
        return {
            name: name,
            owner: ownerName,
            bill_to: bill_to,
            ship_to: ship_to,
            email: email,
            phone: phone,
            cell: cell,
            is_private: isPrivate
        };
    }

    var addOrder = function(user, customer, projects, services){
        return Order.create({
            owner: ownerName,
            created_by: user,
            customer: customer,
            projects: projects,
            services: services
        });
    }

    this.addOneOrder = function(userName,customerName, done){
        addUser(userName)
            .then(function(user){
                var customer = addCustomer(customerName);
                addOrder(user,customer)
                    .then(function(order){
                        done(order);
                    })

            });
    }

}



module.exports = helper;


