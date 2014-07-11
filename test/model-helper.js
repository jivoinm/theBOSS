'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('User'),

    Message = mongoose.model('Message'),
    Form = mongoose.model('Form'),
    Order = mongoose.model('Order');


var helper = function(ownerName){
    if(!ownerName) {
        throw "No owner is set";
    }

    this.owner = function(){
        return ownerName;
    }
    this.clearAll = function(done){
        User.find({}).remove(function(){
            Order.find({}).remove(function(){
                Form.find({}).remove(function(){
                    Message.find({}).remove(function(){
                        //console.log('Cleared all');
                        done();
                    });
                })
            })
        })
    }

    this.addUser = function(userName, email, password){
        return User.create({
            name: userName,
            owner: ownerName,
            email: email || 'user@user.com',
            password: password || 'test'
        });
    }

    this.addForm = function(module, name, fields, tasks){
        return  Form.create({
            module: module,
            owner: ownerName,
            formName:name,
            fields: fields,
            tasks: tasks
        });
    }

    this.setCustomer = function (name, bill_to, ship_to, email,phone,cell, isPrivate){
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

    this.setValuesToFormFieldsAndTasks = function (forms){
        var orderForms = [];
        if(forms){
            forms.forEach(function(form){
                var orderForm = {};
                orderForm.formName = form.formName;
                orderForm.fields = [];
                orderForm.tasks = [];
                //set order fields and tasks
                if(form.fields){
                    form.fields.forEach(function(field, i){
                        var order_field = field;
                        delete order_field._id;
                        if(field.show_options)
                        {
                            order_field.value = field.show_options.split(',')[0];
                        }else{
                            order_field.value = "some value "+i;
                        }
                        orderForm.fields.push(order_field);
                    });
                }

                if(form.tasks){
                    form.tasks.forEach(function(task){
                        var order_task = task;
                        delete order_task._id;

                        orderForm.tasks.push(order_task);
                    });
                }
                orderForms.push(orderForm);
            })
        }
        return orderForms;
    }

    this.addOrder = function(user, customer, forms, services){
        var orderForms = this.setValuesToFormFieldsAndTasks(forms);
        return Order.create({
            owner: ownerName,
            po_number: 'PO'+Math.random(),
            created_by: user,
            customer: customer,
            forms: orderForms,
            services: services
        });
    }
}



module.exports = helper;


