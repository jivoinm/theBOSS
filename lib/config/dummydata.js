'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('User'),

    Message = mongoose.model('Message'),
    Form = mongoose.model('Form'),
    Order = mongoose.model('Order');

var Helper = require("../../test/model-helper");

/**
 * Populate database with sample application data
 */
var helper = new Helper('DelPriore');
helper.clearAll(function(){
    helper.addForm('Order','Kitchen',
            [
                        {
                            order: 1,
                            title: 'Series',
                            type: 'text',
                            require: true
                        },
                        {
                            order: 1,
                            title: 'Material',
                            type: 'select',
                            value: 'Maple',
                            show_options: 'Maple, MDF',
                            require: true
                        },
                        {
                            order: 2,
                            title: 'Upper door style',
                            type: 'select',
                            show_options: 'Traditional, 7000 Flat Panel, 3\' Templeton',
                            require: true
                        },
                        {
                            order: 4,
                            title: 'Lower door style',
                            type: 'select',
                            show_options: 'Traditional',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Hardware door',
                            type: 'select',
                            show_options: 'Handle, 55268-CG10, 4083-1BPN, 55268-CG10',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Hardware drawer',
                            type: 'select',
                            show_options: '55268-CG10, 4076-1BPN, P2152-SN',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Cabinet colour',
                            type: 'select',
                            show_options: 'Espresso, Cloud White, White',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Light valance',
                            type: 'select',
                            show_options: 'PLV96, PLV w/Profile',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Molding',
                            type: 'select',
                            show_options: 'PLV96/ Sub w/ E994',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Countertop Style',
                            type: 'select',
                            show_options: 'Contessa',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Colour',
                            type: 'text',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Code',
                            type: 'text',
                            require: true
                        },
                        {
                            order: 3,
                            title: 'Manufacturer',
                            type: 'text',
                            value: 'DelPriore',
                            require: true
                        }
                    ], [
                        {
                            priority: 1,
                            title: 'Cutting',
                            duration: '2h',
                            status_options:'start,finish'

                        },
                        {
                            priority: 2,
                            title: 'Parts',
                            duration: '2h',
                            status_options:'start,finish'
                        },
                        {
                            priority: 3,
                            title: 'Assemble Cabinetry',
                            duration: '6h',
                            status_options:'start,finish'
                        },
                        {
                            priority: 4,
                            title: 'Finishing',
                            duration: '1h',
                            status_options:'start,finish'
                        }
                    ])
                .then(function(form){
                console.log('Created Form '+form.formName);
                helper.addUser('admin','admin','admin@user.com').then(function(user){
                    console.log('user admin:', user.name);
                    new Array(100)
                    .join().split(',')
                    .map(function(item, i){
                        var customer = helper.setCustomer('Customer'+i);
                        helper.addUser('User'+i,'user',i+'user@user.com').then(
                            function(user){
                                helper.addOrder(user, customer,[form]).then(function(order){
                                    Message.create({
                                        resolved: (i % 2 === 0 ? false : true),
                                        owner: helper.owner(),
                                        order: order._id,
                                        from: user._id,
                                        posted_on: order.date_required,
                                        content: 'Message to be used only for testing purpose and not for anything else. Should be something longer'
                                    })
                                }, function(err){
                                    console.log('Error creating order:', err);
                                });
                            });
                    });
                });
                

            })
});