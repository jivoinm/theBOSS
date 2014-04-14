'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Project = mongoose.model('Project'),
    User = mongoose.model('User'),
    Order = mongoose.model('Order');

var currentUser, order;

describe('Order server tests', function () {

    beforeEach(function (done) {
        User.findOne({name:''},function(err,user){
            if(err) done(err);
            currentUser = user;
            done();
        });
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

        it("should be able to return orders for one owner created by user", function (done) {

            Order.queryOrders('Owner1', {created_by: currentUser._id}, {}, 'created_by customer',
                function (err, orders) {
                    orders.length.should.equal(1);
                    should.exist(orders[0].created_by.name);
                    should.exist(orders[0].customer.name);
                    orders[0].projects.length.should.equal(2);
                    done();
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

        it("should be able to return task from all projects per order", function (done) {
            orderObj.save(function (err, order) {
                order.getProjectTasks(function (tasks) {
                    tasks.should.be.length(3);
                    done();
                });
            });
        });

        it("should return project task with order details", function (done) {
            orderObj.save(function (err, order) {
                order.getProjectTasks(function (tasks) {
                    should.not.exist(tasks[0][0].status);
                    should.exist(tasks[0][1].status);
                    done();
                });
            });
        });

        it("should return task sorted by priority", function (done) {
            orderObj.save(function (err, order) {
                order.getProjectTasks(function (tasks) {
                    tasks[0][0].priority.should.equal(1);
                    tasks[0][1].priority.should.equal(2);
                    tasks[0][2].priority.should.equal(3);
                    done();
                });
            });
        });
    });
    describe("Order form fields", function () {
        it("should be able to return project fields with order field values", function () {
            orderObj.save(function (err, order) {

            });
        });
    });
});