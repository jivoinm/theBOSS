'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    Note = mongoose.model('Note'),
    Form = mongoose.model('Form');

exports.menus = function (req, res, next) {
    var menu = [];
    menu.push( {name: "Dashboard", route:  "/"});

//    if(req.user){
        menu.push( {name: "Orders", route:  "/orders"});
        menu.push( {name: "Calendar", route:  "/calendar"});
        menu.push( {name: "New Order", route:  "/order"});
//        Form.find({
//                owner: req.user.owner
//            }).select('form_name module').lean().exec(function(err,forms){
//                if(err) return res.json(err);
//
//                for(var i=0;i<forms.length;i++){
//                    var moduleName = forms[i].module.toLowerCase().replace(' ','');
//                    var formName = forms[i].form_name.toLowerCase().replace(' ','');
//                    console.log(moduleName);
//                    var menuItem = _.findWhere(menu,{name:moduleName});
//                    if(menuItem){
//                        menuItem.route = '#';
//                        if(!menuItem.subMenus){
//                            menuItem.subMenus = [];
//                        }
//                        if(!menuItem.subMenus[formName]){
//                            menuItem.subMenus[formName] = {};
//                        }
//                        menuItem.subMenus[formName].route = '/'+moduleName+'/'+formName;
//                        menuItem.subMenus[formName].formid = forms[0]._id;
//                    }else{
//                        menuItem = {};
//                        menuItem.name = formName;
//                        menuItem.route = '/'+moduleName+'/'+formName;
//                        menuItem.formid = forms[0]._id;
//                        menu.push(menuItem);
//                    }
//                }
//                console.log(menu);
//                res.send(menu);
//        });
//    }else{
//        res.json(menu);
//    }
      res.send(menu);
};

/**
 * Get  notes
 */
exports.notes = function (req, res) {
    if (req.user) {
        var query = {owner: req.user.owner};
        if(req.query.resolved){
            query.resolved = req.query.resolved
        }

        if(req.query.orderid){
            query.order = req.query.orderid
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
        })
        
    })
}

exports.deleteNote = function (req, res){
    Note.findByIdAndRemove(req.params.id, function(err){
        if (err) return res.json(400, err);
        return res.send({message:'deleted with success'});
    })
}


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