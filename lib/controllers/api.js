'use strict';

var mongoose = require('mongoose'),
    Message = mongoose.model('Message');

exports.menus = function (req, res, next) {
    var menu = [
        {
            "name": "Dashboard",
            "route": "/"
        },
        {
            "name": "Orders",
            "route": "/orders"
        },
        {
            "name": "Materials",
            "route": "/material"
        },
        {
            "name": "Calendar",
            "route": "/calendar"
        }
    ];

//    Form.find({},function(err,forms){
//        if(err) return res.json(err);
//        forms.forEach(function(value,key){
//            menu.push({"name":value.form_name,"route":"/"+value.form_name.toLowerCase()});
//        });
//        res.json(menu);
//    });
    res.json(menu);
};

/**
 * Get user messages
 */
exports.messages = function (req, res) {
    if (req.user) {
        var userName = req.user.email;
        return Message.find({user: userName}, function (err, messages) {
            if (!err) {
                return res.json(messages);
            } else {
                return res.send(err);
            }
        });
    }
};


exports.tasks = function (req, res, next) {
    var tasks = [
        {
            "user": "John Doe",
            "name": "Task 1",
            "min": 0,
            "max": 100,
            "now": 40,
            "status": "success"
        },
        {
            "user": "John Doe",
            "name": "Task 2",
            "min": 0,
            "max": 100,
            "now": 20,
            "status": "info"
        },
        {
            "user": "John Doe",
            "name": "Task 3",
            "min": 0,
            "max": 100,
            "now": 60,
            "status": "warning"
        },
        {
            "user": "John Doe",
            "name": "Task 4",
            "min": 0,
            "max": 100,
            "now": 80,
            "status": "danger"
        }
    ];
    res.json(tasks);
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