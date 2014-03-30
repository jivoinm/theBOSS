'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project');

exports.create = function(req,res,next){

    if(req.body._id){
        var id = req.body._id;
        delete req.body._id;
        Project.update({_id: id},req.body,{ upsert: true },function(err){
            if (err) return res.json(400, err);
            return res.send(req.body);
        });
    }else{
        var project = new Project(req.body);
        project.save(function(err){
            if (err) return res.json(400, err);
            return res.send(project);
        });
    }
}