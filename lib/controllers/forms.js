'use strict';

var mongoose = require('mongoose'),
    Form = mongoose.model('Form');

exports.create = function (req, res) {
    if (req.body._id) {
        var id = req.body._id;
        delete req.body._id;
        Form.update({_id: id}, req.body, { upsert: true }, function (err) {
            if (err) return res.json(400, err);
            return res.send(req.body);
        });
    } else {
        var project = new Form(req.body);
        project.save(function (err) {
            if (err) return res.json(400, err);
            return res.send(project);
        });
    }
}

exports.getAll = function (req,res){
    if(req.user){
        Form.find({owner:req.user.owner})
            .sort({name:1})
            .exec(function(err,projects){
                if(err) res.json(400,err);
                return res.send(projects);
            });
    }
}