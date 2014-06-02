'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Message = mongoose.model('Message'),
    Form = mongoose.model('Form'),
    Order = mongoose.model('Order'),
    Calendar = mongoose.model('Calendar'),
    Customer = mongoose.model('Customer');

/**
 * Populate database with sample application data
 */

// Clear old users, then add a default user
User.find({}).remove(function () {
    User.create({
        owner: 'DelPriore',
        provider: 'local',
        name: 'Admin',
        email: 'a@a.com',
        password: 'test',
        role: 'super'
    }, function (err, user1) {
        User.create({
            owner: 'DelPriore',
            provider: 'local',
            name: 'User1',
            email: 'u@u.com',
            password: 'test',
            role: 'user'}, function (err, user2) {
            console.log('finished populating users');
            Form.find({}).remove(function () {
                Form.create({
                    owner: 'DelPriore',
                    form_name: 'Kitchen',
                    module: 'Projects',
                    fields: [
                        {
                            order: 1,
                            title: 'Series',
                            type: 'text',
                            require: true
                        },
                        {
                            order: 1,
                            title: 'Material',
                            type: 'select',
                            value: 'Maple',
                            show_options: 'Maple, MDF',
                            require: true
                        },
                        {
                            order: 2,
                            title: 'Upper door style',
                            type: 'select2',
                            show_options: 'Traditional, 7000 Flat Panel, 3\' Templeton',
                            require: false
                        },
                        {
                            order: 4,
                            title: 'Lower door style',
                            type: 'select',
                            show_options: 'Traditional',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Hardware door',
                            type: 'select',
                            show_options: 'Handle, 55268-CG10, 4083-1BPN, 55268-CG10',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Hardware drawer',
                            type: 'select',
                            show_options: '55268-CG10, 4076-1BPN, P2152-SN',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Cabinet colour',
                            type: 'select',
                            show_options: 'Espresso, Cloud White, White',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Light valance',
                            type: 'select',
                            show_options: 'PLV96, PLV w/Profile',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Molding',
                            type: 'select',
                            show_options: 'PLV96/ Sub w/ E994',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Countertop Style',
                            type: 'select',
                            show_options: 'Contessa',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Colour',
                            type: 'text',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Code',
                            type: 'text',
                            require: false
                        },
                        {
                            order: 3,
                            title: 'Manufacturer',
                            type: 'text',
                            value: 'DelPriore',
                            require: false
                        }
                    ]
                    ,
                    tasks: [
                        {
                            priority: 1,
                            title: 'Cutting',
                            duration: '2h',
                            status_options:'start,finish'

                        },
                        {
                            priority: 2,
                            title: 'Parts',
                            duration: '2h',
                            status_options:'start,finish'
                        },
                        {
                            priority: 3,
                            title: 'Assemble Cabinetry',
                            duration: '6h',
                            status_options:'start,finish'
                        },
                        {
                            priority: 4,
                            title: 'Finishing',
                            duration: '1h',
                            status_options:'start,finish'
                        }
                    ]
                }, function (err, project1) {
                    console.log("finished populating project1");
                    Customer.find({}).remove(function () {
                        for (var i = 1; i <= 100; i++) {
                            Customer.create({owner: 'DelPriore', name: 'Customer'+i}, function (err, Customer) {
                                console.log('finished populating Customer'+i);

                                Order.find({}).remove(function () {
                                    var order = {
                                        owner: 'DelPriore',
                                        customer: Customer,
                                        created_by: i < 5 ? user1 : user2
                                    };
                                    order.forms = [];
                                    order.forms[0] = {};
                                    order.forms[0].form_name = project1.form_name;
                                    order.forms[0].fields = [];
                                    order.forms[0].tasks = [];
                                    project1.fields.forEach(function(field){
                                        var order_field = field;
                                        delete order_field._id;
                                        if(field.show_options)
                                        {
                                            order_field.value = field.show_options.split('|')[0];
                                        }else{
                                            order_field.value = "some value "+i;
                                        }
                                        order.forms[0].fields.push(order_field);
                                    });

                                    project1.tasks.forEach(function(task){
                                        var order_task = task;
                                        delete order_task._id;

                                        order.forms[0].tasks.push(order_task);
                                    });


                                    Order.create(order, function () {
                                        console.log('finished populating order' + i);
                                    });
                                });
                            })
                        }
                    });
                });
            });
        });
    });
});

Message.find({}).remove(function () {
    Message.create({user: 'a@a.com', type: 'comment', from: 'John Doe', content: 'message1', time: new Date(2014, 1, 1)}, function () {
        console.log('finished populating MESSAGE');
    })
    Message.create({user: 'u@u.com', type: 'task', from: 'John Doe', content: 'message2', time: new Date()}, function () {
        console.log('finished populating MESSAGE');
    })
});

Calendar.find({}).remove(function(){
    console.log('deleted calendars');
});


