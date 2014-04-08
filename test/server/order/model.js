'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    Order = mongoose.model('Order');

var orderObj, user2;
function CreateProject(ownerName, projectName, done) {
    var project = new Project({
        owner: ownerName,
        name: projectName,
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
                title: projectName + ' Task2',
                duration: '2h'
            },
            {
                priority: 1,
                title: projectName + ' Task1',
                duration: '1h'
            },
            {
                priority: 3,
                title: projectName + ' Task3',
                duration: '1h'
            }
        ]
    });
    project.save(done);
}
function CreateOrder(ownerName, customer, projects, createdBy) {
    return new Order({
        owner: ownerName,
        customer: customer,
        projects: projects,
        created_by: createdBy
    });
}
function DeleteAllFirst() {
    Project.remove().exec();
    Order.remove().exec();
    Customer.remove().exec();
    User.remove().exec();
}

function SetupOrder1(done) {
    new User({name: 'User1', email: 'qwe@asd.com', password: '1234'}).save(function (err, user) {
        if (err) done(err);
        var user1 = user;

        CreateProject('Owner1', 'Project1', function (err, project) {
            var project1 = project;
            CreateProject('Owner1', 'Project2', function (err, project) {
                var project2 = project;
                CreateProject('Owner1', 'Project3', function (err, project) {
                    var project3 = project;
                    //create customer
                    new Customer({name: 'Customer'}).save(function (err, customer) {
                        //create orders
                        orderObj = CreateOrder('Owner1', customer, [
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
                            },
                            {
                                project: project3,
                                field_values: [
                                    {
                                        'Field name1': 'field1 value'
                                    }
                                ]
                            }
                        ], user1);
                        done();
                    });
                })
            })
        });
    });
}
function SetupOrders2(done) {
    new User({name: 'User2', email: 'qwe2@asd.com', password: '1234'}).save(function (err, user) {
        if (err) done(err);
        user2 = user;
        CreateProject('Owner1', 'Project4', function (err, project) {
            var project1 = project;
            CreateProject('Owner2', 'Project1', function (err, project) {
                var project2 = project;
                CreateProject('Owner1', 'Project5', function (err, project) {
                    var project3 = project;
                    //create customer
                    new Customer({name: 'Customer'}).save(function (err, customer) {
                        //create orders
                        var order1 = CreateOrder('Owner1', customer, [
                            {
                                project: project1,
                                field_values: [
                                    {
                                        'Field name1': 'field1 value'
                                    }
                                ]
                            },
                            {
                                project: project3,
                                field_values: [
                                    {
                                        'Field name1': 'field1 value'
                                    }
                                ]
                            }
                        ], user2);
                        order1.save(function (err, order) {
                            var order2 = CreateOrder('Owner2', customer, [
                                {
                                    project: project2,
                                    field_values: [
                                        {
                                            'Field name1': 'field1 value'
                                        }
                                    ]
                                }
                            ], user2);
                            order2.save(function () {
                                done();
                            })

                        });
                    });
                })
            })
        });
    });
}
describe('Order server tests', function () {

    beforeEach(function (done) {
        DeleteAllFirst();
        SetupOrder1(done);
    });

    it("should have created an order with three projects", function (done) {
        orderObj.save(function (err, order) {
            Order.findById(order._id, function (err, order) {
                order.projects.length.should.equal(3);
                done();
            });
        });
    });

    describe("Order queries", function () {

        beforeEach(function (done) {
            SetupOrders2(done);
        });

        it("should be able to return orders for one owner created by user", function (done) {
            orderObj.save(function () {
                Order.queryOrders('Owner1', {created_by: user2._id}, {}, 'created_by customer',
                    function (err, orders) {
                        orders.length.should.equal(1);
                        should.exist(orders[0].created_by.name);
                        should.exist(orders[0].customer.name);
                        orders[0].projects.length.should.equal(2);
                        done();
                    });
            });
        });

        it("should be able to return orders for one owner order by created date desc", function (done) {
            orderObj.save(function (err, order) {
                Order.queryOrders('Owner1', {}, {last_updated_on: 1}, 'created_by customer',
                    function (err, orders) {
                        orders[0].last_updated_on.getSeconds().should.be.exactly(order.last_updated_on.getSeconds());
                        done();
                    });
            });
        });

        it("should be able to return task from all projects per order", function () {
            orderObj.save(function (err, order) {
                order.getProjectTasks(function (tasks) {
                    tasks.should.be.length(6)
                });
            });
        });
    });
});