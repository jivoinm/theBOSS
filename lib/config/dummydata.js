'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Message = mongoose.model('Message'),
    Project = mongoose.model('Project'),
    Order = mongoose.model('Order'),
    Customer = mongoose.model('Customer'),
    Thing = mongoose.model('Thing');

/**
 * Populate database with sample application data
 */



// Clear old users, then add a default user
User.find({}).remove(function() {
    User.create({
            owner: 'Test Owner',
            provider: 'local',
            name: 'Test User',
            email: 'test@test.com',
            password: 'test'
        }, function (err, user) {
            console.log('finished populating users');
            Customer.find({}).remove(function () {
                Customer.create({name: 'Customer'}, function (err, Customer) {
                    console.log('finished populating Customer');
                    Project.find({}).remove(function () {
                        Project.create({
                            owner: 'Test Owner',
                            name: 'Project1',
                            fields: [
                                {
                                    field_order: 1,
                                    field_title: 'Field name1',
                                    field_type: 'text',
                                    field_value: '',
                                    field_require: true
                                },
                                {
                                    field_order: 2,
                                    field_title: 'Field name2',
                                    field_type: 'text',
                                    field_value: '',
                                    field_require: true
                                }
                            ],
                            tasks: [
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
                            ]
                        }, function (err, project1) {
                            console.log("finished populating project1");
                            Project.create({
                                owner: 'Test Owner',
                                name: 'Project2',
                                fields: [
                                    {
                                        field_order: 1,
                                        field_title: 'Field name1',
                                        field_type: 'text',
                                        field_value: '',
                                        field_require: true
                                    },
                                    {
                                        field_order: 2,
                                        field_title: 'Field name2',
                                        field_type: 'text',
                                        field_value: '',
                                        field_require: true
                                    }
                                ],
                                tasks: [
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
                                ]
                            }, function (err, project2) {
                                console.log("finished populating project2");
                                Order.find({}).remove(function () {
                                    Order.create({
                                        owner: 'Test Owner',
                                        customer: Customer,
                                        projects: [
                                            {
                                                project: project1,
                                                field_values: [
                                                    {
                                                        'Field name1': 'field1 value'
                                                    }
                                                ]
                                            },
                                            {
                                                project: project2,
                                                field_values: [
                                                    {
                                                        'Field name1': 'field1 value'
                                                    }
                                                ]
                                            }
                                        ],
                                        created_by: user}, function () {
                                        console.log('finished populating order1');
                                    });
                                });
                            });
                        });
                    });

                });
            });
        }
    );
});

Message.find({}).remove(function(){
    Message.create({user:'test@test.com',type:'comment',from:'John Doe',content:'message1',time: new Date(2014,1,1)}, function() {
        console.log('finished populating MESSAGE');
    })
    Message.create({user:'test@test.com',type:'task',from:'John Doe',content:'message2',time: new Date()},function() {
        console.log('finished populating MESSAGE');
    })
});



