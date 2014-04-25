'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    Order = mongoose.model('Order');


describe('Order server tests', function () {
    var admin, user, orderObj;
    beforeEach(function (done) {
        // Clear old users, then add a default user
        User.find({}).remove(function () {
            User.create({
                    owner: 'Test Owner',
                    provider: 'local',
                    name: 'Admin',
                    email: 'admin@a.com',
                    password: 'test',
                    role: 'super'
                }, function (err, user1) {
                    admin = user1;
                    User.create({
                        owner: 'Test Owner',
                        provider: 'local',
                        name: 'User1',
                        email: 'user@u.com',
                        password: 'test',
                        role: 'user'}, function (err, user2) {
                        user = user2;
                        Customer.find({}).remove(function () {
                            Customer.create({owner: 'Test Owner', name: 'Customer'}, function (err, Customer) {
                                Project.find({}).remove(function () {
                                    Project.create({
                                        owner: 'Test Owner',
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
                                        Project.create({
                                            owner: 'Test Owner',
                                            name: 'Project2',
                                            fields: [
                                                {
                                                    field_order: 2,
                                                    field_title: 'Field name1',
                                                    field_type: 'text',
                                                    field_value: '',
                                                    field_require: true
                                                },
                                                {
                                                    field_order: 1,
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
                                                                },{
                                                                    'Field name2': 'field2 value'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            project: project2,
                                                            field_values: [
                                                                {
                                                                    'Field name1': 'field1 value'
                                                                }
                                                            ],
                                                            tasks: [
                                                                {
                                                                    title: 'Project2 Task2',
                                                                    status: 'started'
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    created_by: user1}, function (err, order) {
                                                    orderObj = order;
                                                    done();
                                                });

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

    });

    it("should have created an order with two projects", function (done) {
        Order.findById(orderObj._id, function (err, order) {
            order.projects.length.should.equal(2);
            done();
        });
    });


    it("should be able to return orders for one owner created by user", function (done) {

        Order.queryOrders('Test Owner', {created_by: admin}, {}, 'created_by customer',
            function (err, orders) {
                orders.length.should.equal(1);
                should.exist(orders[0].created_by.name);
                should.exist(orders[0].customer.name);
                orders[0].projects.length.should.equal(2);
                done();
            });
    });

    it("should be able to return orders for one owner order by created date desc", function (done) {
        Order.create({
            owner: 'Test Owner',
            customer: orderObj.customer,
            projects: [
                {
                    project: orderObj.projects[1].project,
                    field_values: [
                        {
                            'Field name1': 'field1 value'
                        }
                    ]
                },
                {
                    project: orderObj.projects[1].project,
                    field_values: [
                        {
                            'Field name1': 'field1 value'
                        }
                    ]
                }
            ],
            created_by: orderObj.created_by}, function (err, order) {
            Order.queryOrders('Test Owner', {}, {last_updated_on: 1}, 'created_by customer',
                function (err, orders) {
                    orders[0].last_updated_on.getSeconds().should.be.exactly(order.last_updated_on.getSeconds());
                    done();
                });

        });

    });

    it("should be able to return task from all projects per order", function (done) {
        orderObj.getProjectTasks(function (tasks) {
            tasks.should.be.length(2);
            done();
        });
    });

    it("should return project task with updated order details", function (done) {
        orderObj.getProjectTasks(function (tasks) {
            should.not.exist(tasks[0].tasks[0].status);
            should.exist(tasks[1].tasks[1].status);
            done();
        });
    });

    it("should return task sorted by priority", function (done) {
        orderObj.getProjectTasks(function (tasks) {
            tasks[0].tasks[0].priority.should.equal(1);
            tasks[0].tasks[1].priority.should.equal(2);
            tasks[0].tasks[2].priority.should.equal(3);
            done();
        });
    });

    it("should return project fields sorted by order",function(done){
        orderObj.getProjects(function(projects){
            projects[0].project.should.equal('Kitchen');
            projects[0].fields[0].field.field_order.should.equal(1);
            projects[0].fields[0].field.field_title.should.equal('Field name1');
            projects[0].fields[0].field_value.should.equal('field1 value');
            done();
        });
    });


});