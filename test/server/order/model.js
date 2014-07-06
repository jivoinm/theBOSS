'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Form'),
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
                                        form_name: 'Kitchen',
                                        fields: [
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
                                        ]
                                        ,
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
                                            form_name: 'Project2',
                                            fields: [
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
                                                            form_name: 'Kitchen',
                                                            fields: [{
                                                                        order: 1,
                                                                        title: 'Field name1',
                                                                        type: 'text',
                                                                        value: 'default value',
                                                                        require: true
                                                                    }
                                                                ]

                                                        },
                                                        {
                                                            form_name: 'Form 2',
                                                            fields: [
                                                                {
                                                                    order: 1,
                                                                    title: 'Field name1',
                                                                    type: 'text',
                                                                    value: 'default value',
                                                                    require: true
                                                                }
                                                            ]
                                                            ,
                                                            tasks: [
                                                                {
                                                                    priority: 1,
                                                                    title: 'Project2 Task1',
                                                                    duration: '1h'

                                                                },
                                                                {
                                                                    priority: 1,
                                                                    title: 'Project2 Task2',
                                                                    duration: '2h',
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

        Order.queryOrders({owner:'Test Owner', created_by: admin},null, 'created_by customer').addBack(
            function (err,orders) {
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
            created_by: orderObj.created_by}, function (err, order) {
            Order.queryOrders({owner:'Test Owner'}, {last_updated_on: 1}, 'created_by customer').addBack(
                function (err,orders) {
                    orders[0].last_updated_on.getSeconds().should.be.exactly(order.last_updated_on.getSeconds());
                    done();
                });

        });

    });

    it("should be able to return task from all projects per order", function (done) {
        orderObj.projects[1].tasks.should.be.length(2);
        done();
    });

    it("should save model values on update", function(done){
        orderObj.status = 'status changed';

        var order_id = orderObj._id;
        delete orderObj._id;
        orderObj = orderObj.toObject();

        Order.update({_id:order_id},orderObj,function(err){
            should.not.exists(err);
            Order.findById(order_id,function(err,order){
                order.status.should.equal('status changed');
                done();
            })

        })
    });

    it("should query order by customer name and return one result", function(done){
        Customer.find({name: new RegExp('^Cust','i')},{_id:1}, function(err, customers){
            Order.find({customer: {$in: customers}})
                .populate('customer')
                .exec(function(err,res){
                    res.should.be.length(1);
                    done();
                });
        });

    })

});