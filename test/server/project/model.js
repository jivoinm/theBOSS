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
        project.save(function () {
            var projectDup = new Project(project)
            projectDup.save(function (err) {
                should.exist(err);
                done();
            });
        });
    });

    it("should not error if project name don't exist on the different owner", function (done) {

        project.save(function () {
            var projectDup = new Project({
                owner: 'Owner2',
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
            projectDup.save(function (err) {
                // console.log(err);
                should.not.exist(err);
                done();
            });
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

    it("should be able to add and save project task", function (done) {
        project.tasks.push({priority: 1, title: 'Task1', duration: '1h'});
        project.tasks.push({priority: 2, title: 'Task2', duration: '1h'});
        project.increment();
        project.save(function (err, project) {
            console.log(err);

            Project.find({}, function (err, projects) {
                should.not.exist(err);
                // console.log(projects);
                (projects.length === 1).should.be.true;
                (projects.tasks.length === 2).should.be.true;
                done();
            });
        });
    });

});