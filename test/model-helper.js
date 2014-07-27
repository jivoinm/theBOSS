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

    this.randomDate = function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
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
            email: email || userName+'@email.com',
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

    this.setValuesToFormFieldsAndTasks = function (forms, customer){
        var orderForms = [];
        if(forms){
            forms.forEach(function(form){
                var orderForm = {};
                orderForm.form_name = form.formName;
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
                            order_field.value =  customer.name + " some value "+i;
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
        var orderForms = this.setValuesToFormFieldsAndTasks(forms, customer);
        var created_on = this.randomDate(new Date(2012, 0, 1), new Date());
        var date_required = this.randomDate(new Date(2012, 0, 1), new Date(new Date().setMonth(new Date().getMonth() + 2)));
        var status = date_required < new Date() ? 'Finished' : 'New';
        return Order.create({
            owner: ownerName,
            po_number: 'PO '+Math.floor((Math.random()*1000)+1),
            status: status,
            createdBy:{
                user_id: user._id,
                name: user.name,
                email: user.email
            },
            last_updated_by:{
                user_id: user._id,
                name: user.name,
                email: user.email
            },
            created_on: created_on,
            date_required: date_required,
            customer: customer,
            forms: orderForms,
            services: services
        });
    }

    this.addTestOrders = function (nrOrders, done){
        this.clearAll(function () {
            this.addForm('Module1', 'Form1', [
                    {
                        order: 1,
                        title: 'Field name1',
                        type: 'text',
                        default_value: 'default value',
                        require: true
                    },
                    {
                        order: 2,
                        title: 'Field name2',
                        type: 'text',
                        require: true
                    }
                ],[
                    {
                        priority: 2,
                        title: 'Project1 Task2',
                        duration: '2h'
                    },
                    {
                        priority: 1,
                        title: 'Project1 Task1',
                        duration: '1h'
                    },
                    {
                        priority: 3,
                        title: 'Project1 Task3',
                        duration: '1h'
                    }
                ])
                .then(function (form) {
                    this.addForm('Module1', 'Form2', [
                            {
                                order: 1,
                                title: 'Field name1',
                                type: 'text',
                                default_value: 'default value',
                                require: true
                            },
                            {
                                order: 2,
                                title: 'Field name2',
                                default_value: 'default value',
                                type: 'text',
                                require: false
                            }
                        ], [
                            {
                                priority: 2,
                                title: 'Project2 Task2',
                                duration: '2h'
                            },
                            {
                                priority: 1,
                                title: 'Project2 Task1',
                                duration: '1h'
                            },
                            {
                                priority: 3,
                                title: 'Project2 Task3',
                                duration: '1h'
                            }
                        ]).then(function(form2){
                            //Create customer and add order
                            var orders = []
                            new Array(nrOrders)
                                .join().split(',')
                                .map(function(item, i){
                                    var customer = helper.setCustomer('Customer'+i);
                                    helper.addUser('User'+i,i+'user@user.com').then(
                                        function(user){
                                            helper.addOrder(user, customer,[form,form2]).then(function(order){
                                                console.log('user email:', user.email);
                                                console.log('user password:', user.password);
                                                console.log('Created order for '+order.customer.name);
                                                orders.push(order);
                                            }, function(err){
                                                console.log('Error creating order:', err);
                                            });
                                        });
                                });
                            done(orders);
                        })
                })
        });
    }
}



module.exports = helper;


