'use strict';

var mongoose = require('mongoose'),
    _ = require('underscore'),
    Message = mongoose.model('Message'),
    Form = mongoose.model('Form');

exports.menus = function (req, res, next) {
    var menu = [];
    menu.push( {name: "Dashboard", route:  "/"});

//    if(req.user){
        menu.push( {name: "Orders", route:  "/orders"});
        menu.push( {name: "Calendar", route:  "/calendar"});
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
 * Get user messages
 */
exports.messages = function (req, res) {
    if (req.user) {

        Message.find({owner: req.user.owner}).sort({posted_on: -1}).limit(100).exec(function (err, messages) {
            if(err) res.json(err);
            return res.send(messages);
        });
    }
};

exports.createMessage = function (req, res) {
    if (req.user) {
        var message = req.body;
        message.from = req.user.name;
        message.owner = req.user.owner;
        message.posted_on = new Date();
        Message.create(message, function (err, message) {
            if(err) res.json(err);
            return res.send(message);
        });
    }
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
            "type": "message",
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