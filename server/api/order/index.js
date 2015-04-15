'use strict';

var express = require('express');
var controller = require('./order.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

router.get('/',auth.isAuthenticated(), controller.loadLatest);
router.get('/services',auth.isAuthenticated(), controller.services);
router.get('/unscheduled',auth.isAuthenticated(), controller.unscheduled);
router.get('/todotasks',auth.isAuthenticated(),controller.toDoTasks);
router.get('/shippingList',auth.isAuthenticated(),controller.shippingList);
router.get('/accessories',auth.isAuthenticated(),controller.accessories);
router.get('/comments',auth.isAuthenticated(),controller.comments);
router.get('/:id',auth.isAuthenticated(), controller.loadOrder);
router.get('/:id/projects',auth.isAuthenticated(), controller.loadOrderProjectFields);
router.post('/:id/upload',auth.isAuthenticated(), controller.fileUpload);
router.post('/',auth.isAuthenticated(), controller.createOrder);
router.post('/:id',auth.isAuthenticated(), controller.updateOrder);
router.delete('/:id',auth.isAuthenticated(), controller.delete);
router.patch('/:id/status/:status',auth.isAuthenticated(), controller.updateStatus);
router.patch('/:id/calendar_update_date/:property/:date',auth.isAuthenticated(), controller.updateCalendarDate);
router.get('/calendar/:from/:to',auth.isAuthenticated(),controller.loadOrdersByStatusAndPeriod);
router.get('/calendar/:from/:to/:status',auth.isAuthenticated(),controller.loadOrdersByStatusAndPeriod);
router.get('/calendar/:from/:to/services/:status',auth.isAuthenticated(),controller.loadServicesByStatusAndPeriod);

module.exports = router;
