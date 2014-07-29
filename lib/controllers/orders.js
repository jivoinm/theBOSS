'use strict';

var mongoose = require('mongoose'),
    fs = require('fs'),
    moment = require('moment'),
    Project = mongoose.model('Form'),
    Order = mongoose.model('Order');



function QueryOrders(queryOrders, sort, page, limit, res) {
    var query = Order.find(queryOrders)
        .select('customer.name po_number createdBy last_updated_by created_on last_updated_on date_required status')
        .sort(sort);
    if(page){
        query.skip((page * limit) - limit);
    }

    if(limit){
        query.limit(limit);
    }


    query.exec(function(err, orders){
        if(err) res.json(400,err);
        Order.count(queryOrders).exec(function (err, count) {
            return res.json({
                orders: orders,
                page: page,
                totalOrders: count
            });
        })

    });

}

function FindOrder(req, callout){
    Order.findOne({
            _id: req.params.id,
            owner: req.user.owner}
        , function (err, order) {
            callout(err,order);
        });
}

exports.delete = function (req, res, next) {
    FindOrder(req, function (err, order) {
        if (err) res.send(err);
        order.remove(function (){
            if (err) next(err);
            return res.json({message: 'deleted order'})
        })
    });
};
exports.query = function (req, res, next) {
};
exports.loadOrder = function (req, res) {
    if(req.user && req.params.id){
        FindOrder(req, function (err, order) {
            if (err) res.send(err);
            if(!order) res.json({error: 'This order does not exists'});
            return res.send(order)
        });
    }

};

exports.loadOrderProjectFields = function(req,res){
    if(req.user && req.params.id){
        FindOrder(req, function (err, order) {
            if (err) res.send(err);
            if(!order) res.json({error: 'This order does not exists'});
            return res.json(order.projects)
        });
    }

};


exports.tasks = function(req,res){
    Order.find({
        owner: req.user.owner,
        status: req.params.status,
        'forms.tasks':{$elemMatch: {$or: [{status: {$exists:false}}, {status:'in progress'}]}}
    })
        .sort({date_required: 1})
        .exec(function(err, orders){
            if(err) res.json(400,err);
            return res.send(orders);
        });
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
            if(err) res.json(400,err);
            return res.send(orders);
        });
};

exports.comments = function(req,res){
    var query = {owner: req.user.owner};
    Order.find(query)
        .select('customer po_number createdBy comments')
        .sort({date_required: -1})
        .exec(function(err, orders){
            if(err) res.json(400,err);
            return res.send(orders);
        });
};


exports.loadUserLatest  = function (req, res) {
    if (req.user) {
        var queryOrders = {
            owner: req.user.owner,
            'created_by.user_id': req.params.id
        };
        QueryOrders(queryOrders, null,null,10, res);
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
                queryOrders["$or"] = [{"customer.name": queryText}, {"forms.fields": {$elemMatch: {"value": queryText}}},{po_number: queryText}];
            }
            if(req.query.status){
                queryOrders.status = new RegExp(req.query.status,"i");
            }
            page = req.query.page;
            limit = req.query.limit;
        }


        QueryOrders(queryOrders, {date_required:-1},page,limit, res);
    }
}

exports.loadOrdersByStatusAndPeriod = function (req, res){
    var queryOrders = {
        owner: req.user.owner,
        status: req.params.status,
        date_required: {"$gte": moment(req.params.from), "$lt": moment(req.params.to)}
    };


    QueryOrders(queryOrders, {date_required:1},null,null,res);
}

exports.unscheduled = function (req, res) {
    QueryOrders({
        owner: req.user.owner,
        scheduled: false
    }, {date_required:-1},null,null, res);
}

exports.updateStatus = function (req, res){
    Order.update({ _id: req.params.id, owner: req.user.owner},
        {$set: {status: req.params.status}},
        function (err){
            if(err) res.json(400,err);
            FindOrder(req, function (err, order){
                if (err) return res.json(400, err);
                return res.send(order);
            })
        });
}

exports.updateDateRequired = function (req, res){
    Order.update({ _id: req.params.id, owner: req.user.owner},
        {$set: {date_required: req.params.date_required}},
        function (err){
            if(err) res.json(400,err);
            FindOrder(req, function (err, order){
                if (err) return res.json(400, err);
                return res.send(order);
            })
        });
}


exports.createOrder = function(req,res){
    if(req.user){
        var order = req.body;
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
        })
    }
}

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
        }

        order.last_updated_on = new Date();

        Order.update({_id:id},order,function(err){
            if(err) res.json(400,err);
            FindOrder(req, function (err, order){
                if (err) return res.json(400, err);
                return res.send(order);
            })
        })
    }
}

exports.fileUpload = function (req, res, next){
    // create a form to begin parsing
    var form = new multiparty.Form();
    var file;

    form.on('error', next);
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
        console.log('upload %s %s', part.name, part.filename);
        var out = fs.createWriteStream(__dirname+'/../../app/uploads/'+ part.filename);
        part.pipe(out);
    });


    // parse the form
    form.parse(req);
};

