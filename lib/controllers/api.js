'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    Note = mongoose.model('Note'),
    Form = mongoose.model('Form');

exports.menus = function (req, res, next) {
    var menu = [];
    menu.push( {name: "Dashboard", route:  "/"});
    menu.push( {name: "Orders", route:  "/orders"});
    menu.push( {name: "Calendar", route:  "/calendar"});
    menu.push( {name: "New Order", route:  "/order"});
    res.send(menu);
};

/**
 * Get  notes
 */
exports.notes = function (req, res) {
    if (req.user) {
        var query = {owner: req.user.owner};
        if(req.query.resolved){
            query.resolved = req.query.resolved;
        }

        if(req.query.orderid){
            query.order = req.query.orderid;
        }
        Note.find(query)
        .populate({path:'order', select:'_id po_number'})
        .populate({path:'from', select:'_id name email'})
        .sort({posted_on: 1})
        .exec(function (err, notes) {
            if(err) return res.json(400,err);
            return res.send(notes);
        });
    }
};

exports.createNote = function (req, res) {
    if (req.user) {
        var note = req.body;
        note.from = req.user._id;
        note.owner = req.user.owner;
        note.posted_on = new Date();
        Note.create(note, function (err, note) {
            if(err) return res.json(400,err);
            return res.send(note);
        });
    }
};

exports.updateNote = function (req, res) {
    var note = req.body;
    note.from = note.from._id;
    note.order = note.order._id;
    note.resolved_by = req.user._id;
    note.resolved_on = new Date();
    delete note._id;
    Note.update({_id:req.params.id},note, {upsert:true}, function (err, count) {
        if(err) return res.json(400,err);
        Note.findById(req.params.id, function (err, msg){
            if(err) return res.json(400,err);
            return res.send(msg);
        });
        
    });
};

exports.deleteNote = function (req, res){
    Note.findByIdAndRemove(req.params.id, function(err){
        if (err) return res.json(400, err);
        return res.send({message:'deleted with success'});
    });
};


exports.alerts = function (req, res, next) {
    var alerts = [
        {
            "type": "comment",
            "content": "New Comment",
            "lastTime": 1392263439506
        },
        {
            "type": "follower",
            "content": "3 New Followers",
            "lastTime": 1392263439506
        },
        {
            "type": "note",
            "content": "Message Sent",
            "lastTime": 1392263439506
        },
        {
            "type": "task",
            "content": "New Task",
            "lastTime": 1392263439506
        },
        {
            "type": "action",
            "content": "Server Rebooted",
            "lastTime": 1392263439506
        }
    ];
    res.json(alerts);
};