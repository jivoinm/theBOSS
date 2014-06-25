'use strict';

var mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    Form = mongoose.model('Form');

exports.menus = function (req, res, next) {
    var menu = [];
    menu["Dashboard"] =  {route:  "/"};
//    menu["Dashboard"] =  {route: "/"};
//        {
//            "name": "Orders",
//            "route": "/orders"
//        },
//        {
//            "name": "Calendar",
//            "route": "/calendar"
//        }
//    ];

    if(req.user){
        Form.find({
                owner: req.user.owner
            },function(err,forms){
                if(err) return res.json(err);

                forms.forEach(function(form,key){
                    var moduleName = form.module.toLowerCase().replace(' ','');
                    var formName = form.form_name.toLowerCase().replace(' ','');
                    console.log(menu[moduleName]);
                    if(menu[moduleName]!=null){
                        menu[moduleName].route = '#';
                        if(!menu[moduleName].subMenus){
                            menu[moduleName].subMenus = [];
                        }
                        if(!menu[moduleName].subMenus[formName]){
                            menu[moduleName].subMenus[formName] = {};
                        }
                        menu[moduleName].subMenus[formName].route = '/'+moduleName+'/'+formName;
                    }else{
                        menu[moduleName] = {};
                        menu[moduleName].route = '/'+moduleName+'/'+formName;
                    }

                });
                res.json(menu);
        });
    }else{
        res.json(menu);
    }

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