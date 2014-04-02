'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project');

var project;
describe('Project server tests', function () {
    before(function (done) {
        project = new Project({
            owner: 'Owner1',
            name: 'Project Name',
            fields: [
                {
                    field_order: 1,
                    field_title: 'Field name1',
                    field_type: 'text',
                    field_value: '',
                    field_require: true
                }
            ]
        });

        // Clear projects before testing
        Project.remove().exec();
        done();
    });

    afterEach(function (done) {
        Project.remove().exec();
        done();
    });

    it("should error if project name already exists on the same owner", function (done) {
        project.save();
        var projectDup = new Project(project)
        projectDup.save(function (err) {
            should.exist(err);
            done();
        });
    });

    it("should not error if project name don't exist on the different owner", function (done) {
        project.save();
        var projectDup = new Project(project)
        projectDup.owner = 'new Owner';
        projectDup.save(function (err) {
            should.not.exist(err);
            done();
        });
    });

    it("should return only owner projects", function (done) {
        project.save(function(){
            //create second project
            var newProject = new Project();
            newProject.name = 'New Project Name';
            newProject.owner = 'new Owner added1';
            newProject.save(function(){
                //create third project
                var newProject = new Project();
                newProject.name = 'New Project Name';
                newProject.owner = 'new Owner added2';
                newProject.save(function(){
                    Project.findOwnerProjects('new Owner added1',function(err,projects){
                        should.not.exist(err);
                        (projects.length === 1).should.be.true;
                        done();
                    })
                });
            });
        });
    });


});