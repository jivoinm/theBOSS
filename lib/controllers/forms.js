'use strict';

var mongoose = require('mongoose'),
    Form = mongoose.model('Form');

exports.createOrUpdate = function (req, res) {
    req.body.owner = req.user.owner;
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
};

exports.deleteForm = function(req, res){
    Form.findByIdAndRemove(req.params.id, function(err){
        if (err) return res.json(400, err);
        return res.send({message:'deleted with success'});
    });
};

exports.getFormsForModule = function (req,res){
    if(req.user){
        Form.find({owner:req.user.owner,module:req.params.module})
            .sort({name:1})
            .exec(function(err,projects){
                if(err) res.json(400,err);
                return res.send(projects);
            });
    }
};

exports.addField = function (req,res){
    if(req.user){
        var field = req.body;
        var target = req.params.target;
        var query = {
            owner: req.user.owner,
            _id:req.params.id
        };
        var setValue= {};
        setValue.$push = {};
        setValue.$push[target] = field;

        Form.update(
            query,
            setValue,
           function(err,updateCount){
                if(err) return res.json(400,err);
                Form.findById(req.params.id, function (err, form) {
                    return res.send(form);    
                });
            });
    }
};

exports.updateField = function (req,res){
    if(req.user){
        var field = req.body;
        var target = req.params.target;
        var query ={};
        query[target+'._id'] = req.params.targetId;
        var setValue= {};
        setValue.$set = {};
        setValue['$set'][target + '.$'] = field;
        Form.update(
            query,
            setValue,
           function(err,updateCount){
                console.log('error', err);
                console.log('updated', updateCount);
                if(err) return res.json(400,err);
                Form.findById(req.params.id, function (err, form) {
                    return res.send(form);    
                });
            });
    }
};

exports.deleteField = function (req, res){
    Form.findOneAndUpdate({
        owner: req.user.owner,
        _id: req.params.id
    }, {
        $pull: {'fields': {_id: req.params.fieldId}}
    }, { safe: true }, function(err, form){
        if(err) res.json(err);
        return res.send(form);
    });
};