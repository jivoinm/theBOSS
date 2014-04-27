'use strict';
var Order,User, app, mongoose, request, server, should, project, agent;

should = require("should");
app = require("../../../server");
mongoose = require("mongoose");
Order = mongoose.model("Order");
User = mongoose.model("User");
request = require("supertest");
agent = request.agent(app);

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
            Order.find({}).remove(function () {
                Order.create({
                    owner: 'MirceaSoft',
                    projects: [
                        {
                            project: 'Kitchen',
                            field_sets:[{
                                title:'Materials',
                                fields: [
                                    {
                                        order: 1,
                                        title: 'Field name1',
                                        type: 'text',
                                        value: 'default value',
                                        require: true
                                    }
                                ]
                            }]

                        },
                        {
                            project: 'Form 2',
                            field_sets:[{
                                title:'Materials',
                                fields: [
                                    {
                                        order: 1,
                                        title: 'Field name1',
                                        type: 'text',
                                        value: 'default value',
                                        require: true
                                    }
                                ]
                            }],
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
    });

    it('should create new order on post', function (done) {
        agent
            .post('/api/orders')
            .send({
                owner: 'Test Owner',
                projects: [
                    {
                        project: 'Kitchen',
                        field_sets:[{
                            title:'Materials',
                            fields: [
                                {
                                    order: 1,
                                    title: 'Field name1',
                                    type: 'text',
                                    value: 'default value',
                                    require: true
                                }
                            ]
                        }]

                    }
                ]
            })
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body._id);
                done();
            });
    });

    it("should update existing order on post", function (done) {
        order.status = 'status changed';
        agent
            .post('/api/orders/'+order._id)
            .send(order)
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body.message);
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

});
