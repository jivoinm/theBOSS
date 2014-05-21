'use strict';

var mongoose = require('mongoose'),
    Form = mongoose.model('Form');

exports.createOrUpdate = function (req, res) {
    if (req.body._id) {
        var id = req.body._id;
        delete req.body._id;
        Form.update({_id: id}, req.body, { upsert: true }, function (err, form) {
            if (err) return res.json(400, err);
            return res.send('updated: '+form);
        });
    } else {
        var project = new Form(req.body);
        project.save(function (err) {
            if (err) return res.json(400, err);
            return res.send(project);
        });
    }
}

exports.getFormsForModule = function (req,res){
    if(req.user){
        Form.find({owner:req.user.owner,module:req.params.module})
            .sort({name:1})
            .exec(function(err,projects){
                if(err) res.json(400,err);
                return res.send(projects);
            });
    }
}

exports.addField = function (req,res){
    if(req.user){
        var field = req.body.field;
        var query = {
            owner: req.user.owner,
            _id:req.params.id
        };

        Form.findOneAndUpdate(
            query,
            {
                '$push':{'fields': field}
            },
            {safe: true, upsert: false})
            .exec(function(err,projects){
                if(err) res.json(400,err);
                return res.send(projects);
            });
    }
}