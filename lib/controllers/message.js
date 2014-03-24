'use strict';

var mongoose = require('mongoose'),
    Message = mongoose.model('Message');

/**
 * Get user messages
 */
exports.get = function(req, res) {
    var userName = req.params.userName;
    console.log(userName);
    return Message.find({user:userName}, function (err, messages) {
        if (!err) {
            return res.json(messages);
        } else {
            return res.send(err);
        }
    });
};