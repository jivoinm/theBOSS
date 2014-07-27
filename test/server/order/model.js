'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Form'),
    User = mongoose.model('User'),
    Order = mongoose.model('Order');

var Helper = require("../../model-helper");
var helper = new Helper('DelPriore');


describe('Order server tests', function () {
    var user, orderObj;
    beforeEach(function (done) {
        helper.clearAll(function () {
            helper.addForm('Module1', 'Form1', [
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
                    helper.addForm('Module1', 'Form2', [
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
                            var customer = helper.setCustomer('Customer');
                            helper.addUser('User', 'user@user.com', 'test1234').then(
                                function (_user_) {
                                    user = _user_;
                                    helper.addOrder(user, customer, [form,form2])
                                        .then(function (_order_) {
                                            orderObj = _order_;
                                            done();
                                        });
                                });
                        })
                })
        });

     });

    it("should have created an order with two projects", function (done) {
        Order.findById(orderObj._id, function (err, order) {
            order.forms.length.should.equal(2);
            done();
        });
    });


    it("should be able to return orders for one owner created by user", function (done) {

        Order.queryOrders({owner: helper.owner(), createdBy: user}, null, 'createdBy').addBack(
            function (err, orders) {
                orders.length.should.equal(1);
                should.exist(orders[0].createdBy.name);
                should.exist(orders[0].customer.name);
                orders[0].forms.length.should.equal(2);
                done();
            });
    });

    it("should be able to return orders for one owner order by created date desc", function (done) {
        Order.create({
            owner: helper.owner(),
            'customer.name': orderObj.customer.name,
            createdBy: orderObj.createdBy}, function (err, order) {
            Order.queryOrders({owner: helper.owner()}, {last_updated_on: -1}, 'createdBy').addBack(
                function (err, orders) {
                    orders[0].last_updated_on.getSeconds().should.be.exactly(order.last_updated_on.getSeconds());
                    done();
                });

        });

    });

    it("should be able to return task from all forms per order", function (done) {
        orderObj.forms[1].tasks.should.be.length(3);
        done();
    });



    it("should query order by customer name and return one result", function (done) {
        var regExp = new RegExp('cust', "i");
        Order.queryOrders({owner: helper.owner(), $or: [{"customer.name": regExp}, {"forms.fields": {$elemMatch: {"value": regExp}}}]}, null, 'createdBy')
            .addBack(function (err, res) {
                res.should.be.length(1);
                done();
            });

    })

});