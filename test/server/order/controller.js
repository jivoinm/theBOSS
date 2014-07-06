'use strict';
var Order,User, app, mongoose, request, server, should, project, agent;

should = require("should");
app = require("../../../server");
mongoose = require("mongoose");
Order = mongoose.model("Order");
User = mongoose.model("User");
request = require("supertest");
agent = request.agent(app);

var Helper = require("../../model-helper");
var helper = new Helper('DelPriore');

describe('Order controller', function () {
    var order,user;
    beforeEach(function (done) {
        helper.clearAll(function(){
            helper.addForm('Module1','Form1',[
                    {
                        order: 1,
                        title: 'Field1',
                        type: 'text',
                        require: true
                    },
                    {
                        order: 2,
                        title: 'Field2',
                        type: 'text',
                        value: 'default value',
                        require: true
                    }
                ],[])
                .then(function(form){
                    //Create customer and add order
                    var customer = helper.setCustomer('Customer');
                    helper.addUser('User','user@user.com','test1234').then(
                        function(user){
                            helper.addOrder(user, customer,[form])
                                .then(function(_order_){
                                    order = _order_;
                                    //login
                                    agent
                                        .post('/api/session')
                                        .send({email: 'user@user.com', password: 'test1234'})
                                        .end(function (err, res) {
                                            agent.saveCookies(res);
                                            done();
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
                owner: helper.owner(),
                forms: [
                    {
                        formName: 'Kitchen',
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
                owner: helper.owner(),
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
        helper.addUser('Mircea','mirce@email.com').then(function(user){
            helper.addOrder(user,helper.setCustomer('Customer To Search')).then(function(order){
                //search for this customer
                agent
                    .get('/api/orders')
                    .query('query=search')
                    .end(function (err, res) {
                        console.log(err,res.body);
                        res.body.should.be.length(1);
                        res.body[0].customer.name.should.equals('Customer To Search');
                        done();
                    });
            }, function(err){
                console.log(err);
            })

        })
    });

});
