'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Message = mongoose.model('Message'),
    Project = mongoose.model('Project'),
    Order = mongoose.model('Order'),
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
                Customer.find({}).remove(function () {
                    Customer.create({owner: 'DelPriore', name: 'Customer'}, function (err, Customer) {
                        console.log('finished populating Customer');
                        Project.find({}).remove(function () {
                            Project.create({
                                owner: 'DelPriore',
                                name: 'Kitchen',
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
                                    owner: 'DelPriore',
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
                                        for (var i = 0; i <= 10; i++) {

                                            Order.create({
                                                owner: 'DelPriore',
                                                customer: Customer,
                                                projects: [
                                                    {
                                                        project: project1,
                                                        field_values: [
                                                            {
                                                                'Field name1': 'field1 value' + i
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        project: project2,
                                                        field_values: [
                                                            {
                                                                'Field name1': 'field1 value' + i
                                                            }
                                                        ],
                                                        tasks:[
                                                            {
                                                                title: 'Project2 Task2',
                                                                status: 'finished',
                                                                done:true
                                                            }
                                                        ]
                                                    }
                                                ],
                                                created_by: i < 5 ? user1 : user2}, function () {
                                                console.log('finished populating order' + i);
                                            });
                                        }
                                    });

                                });
                            });
                        });

                    });
                });
            })
        }
    );
});

Message.find({}).remove(function () {
    Message.create({user: 'a@a.com', type: 'comment', from: 'John Doe', content: 'message1', time: new Date(2014, 1, 1)}, function () {
        console.log('finished populating MESSAGE');
    })
    Message.create({user: 'u@u.com', type: 'task', from: 'John Doe', content: 'message2', time: new Date()}, function () {
        console.log('finished populating MESSAGE');
    })
});



