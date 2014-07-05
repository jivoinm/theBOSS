'use strict';
var Order,User, app, mongoose, request, server, should, project, agent, Customer;

should = require("should");
app = require("../../../server");
mongoose = require("mongoose");
Order = mongoose.model("Order");
User = mongoose.model("User");
Customer = mongoose.model("Customer");
request = require("supertest");
agent = request.agent(app);

var Helper = require("../../model-helper");

describe('Order controller', function () {
    var order,user;
    beforeEach(function (done) {
        User.create({
            provider: 'local',
            name: 'Fake User',
            email: 'user@user.com',
            password: 'pass11',
            owner:'MirceaSoft'
        }, function (err, _user){
            user = _user
            Customer.find({}).remove(function(){
                Customer.create({name: 'customer',owner:'MirceaSoft'}, function(err, cust1){
                    Order.find({}).remove(function () {
                        Order.create({
                            owner: 'MirceaSoft',
                            customer: cust1,
                            projects: [
                                {
                                    project: 'Kitchen',
                                    fields: [
                                        {
                                            order: 1,
                                            title: 'Field name1',
                                            type: 'text',
                                            value: 'default value',
                                            require: true
                                        }
                                    ]


                                },
                                {
                                    project: 'Form 2',
                                    fields: [
                                        {
                                            order: 1,
                                            title: 'Field name1',
                                            type: 'text',
                                            value: 'default value',
                                            require: true
                                        }
                                    ],
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
                            created_by:user

                        }, function (err, _order_) {
                            order = _order_;
                            //login
                            agent
                                .post('/api/session')
                                .send({email: 'user@user.com', password: 'pass11'})
                                .end(function (err, res) {
                                    agent.saveCookies(res);
                                    done();
                                });

                        });
                    });
                });
            })

        });
    });

    it('should create new order on post', function (done) {
        agent
            .post('/api/orders')
            .send({
                customer:{name:'customer'},
                owner: 'MirceaSoft',
                projects: [
                    {
                        project: 'Kitchen',
                        fields: [
                            {
                                order: 1,
                                title: 'Field name1',
                                type: 'text',
                                value: 'default value',
                                require: true
                            }
                        ]
                    }
                ]
            })
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body._id);
                should.exists(res.body.customer.name);
                done();
            });
    });

    it('should update customer details on update', function (done){
        agent
            .post('/api/orders/'+order._id)
            .send({
                customer:{
                _id: order.customer,
                name: 'customer',
                owner:'MirceaSoft',
                bill_to: 'bill to address'
            }})
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body.customer.bill_to);
                done();
            });
    });

    it("should update existing order on post", function (done) {
        agent
            .post('/api/orders/'+order._id)
            .send({
                status: 'started',
                customer: {name: 'new customer'}
                })
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body.status);
                done();
            });
    });

    it("should return existing order on get", function (done) {
        agent
            .get('/api/orders/'+order._id)
            .end(function (err, res) {
                (order._id == res.body._id).should.be.true;
                done();
            });
    });

    it('should return queried orders by customer name', function (done){
        var helper = new Helper('MirceaSoft','My-',100);
        helper.addOneOrder('User1','Customer to search',function(){
            //search for this customer
            agent
                .get('/api/orders')
                .send({text:'search'})
                .end(function (err, res) {
                    console.log(err,res.body);
                    done();
                });
        })
    });

});
