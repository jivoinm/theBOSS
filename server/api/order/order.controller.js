'use strict';

var _ = require('lodash');
var Order = require('./order.model');
var fs = require('fs');
var moment = require('moment');
var Project = require('../form/form.model');
//var _ = require('underscore');



function QueryOrders(queryOrders, sort, page, limit, res) {
  var query = Order.find(queryOrders)
      .select('customer.name po_number createdBy last_updated_by created_on last_updated_on date_required installation_date shipped_date status services doors')
      .sort(sort);
  if(page){
      query.skip((page * limit) - limit);
  }

  if(limit){
      query.limit(limit);
  }

  query.exec(function(err, orders){
      if(err) return res.json(400,err);
      Order.count(queryOrders).exec(function (err, count) {
          return res.json({
              orders: orders,
              page: page,
              totalOrders: count
          });
      });

  });
}

function FindOrder(req, callout){
  Order.findOne({
          _id: req.params.id,
          owner: req.user.owner
      }, function (err, order) {
          callout(err,order);
      });
}

exports.delete = function (req, res, next) {
  new FindOrder(req, function (err, order) {
      if (err) res.send(err);
      order.remove(function (){
          if (err) next(err);
          return res.json({message: 'deleted order'});
      });
  });
};

exports.loadOrder = function (req, res) {
  if(req.user && req.params.id){
      new FindOrder(req, function (err, order) {
          if (err) res.send(err);
          if(!order) res.json({error: 'This order does not exists'});
          return res.send(order);
      });
  }
};

exports.loadOrderProjectFields = function(req,res){
  if(req.user && req.params.id){
      new FindOrder(req, function (err, order) {
          if (err) res.send(err);
          if(!order) res.json({error: 'This order does not exists'});
          return res.json(order.projects);
      });
  }
};


exports.toDoTasks = function(req,res){
  var page, limit;
  if(req.query){
      page = req.query.page;
      limit = req.query.limit;
  }

  var queryOrders = {
          owner: req.user.owner,
          '$or': [{status: 'approved'}, {status: 'in progress'}],
          'forms.tasks': {$elemMatch: {$or: [{status: {$exists:false}}, {status:'in progress'}]}}
      };
  new QueryOrders(queryOrders, {date_required:-1},page,limit, res);
};

exports.shippingList = function(req,res){
  var page, limit;
  if(req.query){
      page = req.query.page;
      limit = req.query.limit;
  }

  var queryOrders = {
          owner: req.user.owner,
          shipped_date:{$exists: false},
          status: 'finished'
      };
  new QueryOrders(queryOrders, {date_required:-1},page,limit, res);
};

exports.accessories = function(req,res){
  var load_all = req.query.all || false;
  var query = {owner: req.user.owner};
  if(!load_all){
      query['ordered_accessories.received'] = false;
  }

  Order.find(query)
      .select('customer po_number createdBy ordered_accessories')
      .sort({date_required: -1})
      .exec(function(err, orders){
          if(err) return res.json(400,err);
          return res.send(orders);
      });
};

exports.comments = function(req,res){

  Order.aggregate({$match: {owner: req.user.owner}},
      {$unwind: "$comments"},
      {$sort: {"comments.created_on":1}},
      {$group: {_id: "$_id",po_number:{$first: "$po_number"}, comments: {$push: "$comments"}}})
      .exec(function(err, orders){
          if(err) return res.json(400,err);
          return res.send(orders);
      });
};


exports.loadUserLatest  = function (req, res) {
  if (req.user) {
      var queryOrders = {
          owner: req.user.owner,
          'createdBy.user_id': req.params.id
      };
      new QueryOrders(queryOrders, {date_required: -1},null,10, res);
  }
};

exports.loadLatest = function (req, res) {
  if (req.user) {
      var queryOrders = {
          owner: req.user.owner
      };

      var page, limit;
      if(req.query){
          if(req.query.text){
              var queryText = new RegExp(req.query.text,"i");
              queryOrders.$or = [{"customer.name": queryText},
              {"forms.fields": {$elemMatch: {"value": queryText}}},
              {po_number: queryText},
              {'createdBy.name': queryText},
              ];
          }
          if(req.query.status){
              queryOrders.status = new RegExp(req.query.status,"i");
          }
          page = req.query.page;
          limit = req.query.limit;
      }

      new QueryOrders(queryOrders, {date_required:-1},page,limit, res);
  }
};

exports.loadOrdersByStatusAndPeriod = function (req, res){
  var queryOrders = {
      owner: req.user.owner,
      $or: [
          { date_required: {"$gte": moment(req.params.from), "$lt": moment(req.params.to)} },
          { installation_date: {"$gte": moment(req.params.from), "$lt": moment(req.params.to)} },
          { shipped_date: {"$gte": moment(req.params.from), "$lt": moment(req.params.to)} },
      ]
  };

  if(req.params.status){
      queryOrders.status = new RegExp(req.params.status,"i");
  }

  if(req.query.text){
      var queryText = new RegExp(req.query.text,"i");
      queryOrders.$or = [{"customer.name": queryText},
              {"forms.fields": {$elemMatch: {"value": queryText}}},
              {po_number: queryText},
              {'createdBy.name': queryText},
              ];
  }
  new QueryOrders(queryOrders, {date_required:1},null,null,res);
};

exports.unscheduled = function (req, res) {
  new QueryOrders({
      owner: req.user.owner,
      scheduled: false
  }, {date_required:-1},null,null, res);
};

exports.updateStatus = function (req, res){
  Order.update({ _id: req.params.id, owner: req.user.owner},
      {$set: {status: req.params.status}},
      function (err){
          if(err) return res.json(400,err);
          new FindOrder(req, function (err, order){
              if (err) return res.json(400, err);
              return res.send(order);
          });
      });
};

exports.updateCalendarDate = function (req, res){
  var update = {};
  update[req.params.property] = req.params.date;
  Order.update({ _id: req.params.id, owner: req.user.owner},
      {$set: update},
      function (err){
          if(err) return res.json(400,err);
          new FindOrder(req, function (err, order){
              if (err) return res.json(400, err);
              return res.send(order);
          });
      });
};


exports.createOrder = function(req,res){
  if(req.user){
      var order = req.body;
      order.status = order.status || 'new';
      order.createdBy = {
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email
      };
      order.last_update_by = {
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email
      };
      order.owner = req.user.owner;
      Order.create(order, function (err, order) {
          if (err) return res.json(400, err);
          return res.send(order);
      });
  }
};

exports.updateOrder = function(req,res){
  if(req.user){
      var id = req.params.id;
      var order = req.body;

      delete order._id;
      delete order.createdBy;
      order.last_updated_by = {
          user_id: req.user._id,
          name: req.user.name,
          email: req.user.email
      };

      order.last_updated_on = new Date();
      var finished = _.all(order.forms, function (form) {
          var isFinished = _.all(form.tasks, function (task){
              return (task.status && task.status === 'done');
          });
          return isFinished;
      });

      var inProgress = _.any(order.forms, function (form) {
          var status = _.any(form.tasks, function (task){
              return (task.status && task.status !== 'done');
          });
          return status;
      });

      order.status = finished ? 'finished' : inProgress ? 'in progress' : order.status;
      Order.update({_id: req.params.id}, order, {upsert: true}, function (err, nrRecords, rawRecord) {
          if(err) return res.json(400,err);
          new FindOrder(req, function (err, order) {
              if (err) res.json(400, err);
              if(!order) res.json({error: 'This order does not exists'});
              return res.json(order);
          });
      });
  }
};

exports.fileUpload = function (req, res, next){
  // create a form to begin parsing
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  var file;

  form.on('error', function (error){
      res.send(error);
  });
  form.on('close', function(){
      res.json(file);
  });

  // listen on part event for image file
  form.on('part', function(part){
      if (!part.filename) return;
      if (part.name !== 'file') return part.resume();
      file = {};
      file.filename = part.filename;
      file.size = 0;
      part.on('data', function(buf){
          file.size += buf.length;
      });
      var out = fs.createWriteStream(__dirname+'/../../app/uploads/'+ part.filename);
      part.pipe(out);
  });


  // parse the form
  form.parse(req);
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
};

// Get list of orders
exports.index = function(req, res) {
  Order.find(function (err, orders) {
    if(err) { return handleError(res, err); }
    return res.json(200, orders);
  });
};

// Get a single order
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    return res.json(order);
  });
};

// Creates a new order in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, order) {
    if(err) { return handleError(res, err); }
    return res.json(201, order);
  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, order) {
    if (err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    var updated = _.merge(order, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, order);
    });
  });
};

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    order.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}