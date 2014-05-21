'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Form');

var project;
describe('Form server tests', function () {
    before(function (done) {
        project = new Project({
            owner: 'Owner1',
            form_name: 'Form Name',
            fields: [
                {
                    order: 1,
                    title: 'Field name1',
                    type: 'text',
                    default_value: 'default value',
                    require: true
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
                form_name: 'Form Name',
                        fields: [
                            {
                                order: 1,
                                title: 'Field name1',
                                type: 'text',
                                default_value: 'default value',
                                require: true
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
        project.save(function () {
            //create second project
            var newProject = new Project();
            newProject.name = 'New Form Name';
            newProject.owner = 'new Owner added1';
            newProject.save(function () {
                //create third project
                var newProject = new Project();
                newProject.name = 'New Form Name';
                newProject.owner = 'new Owner added2';
                newProject.save(function () {
                    Project.findOwnerProjects('new Owner added1', function (err, projects) {
                        should.not.exist(err);
                        (projects.length === 1).should.be.true;
                        done();
                    })
                });
            });
        });
    });

    it("should be able to add and save project task", function (done) {
        project.save(function (err, project) {
            Project.findByIdAndUpdate(project._id,{
                '$pushAll': {'tasks': [{priority: 1, title: 'Task1', duration: '1h'},{priority: 2, title: 'Task2', duration: '1h'}]}
            }, {safe:true, upsert:true},function(err, project){
                should.not.exist(err);
                project.tasks.length.should.equal(2);
                done();
            })
        });
    });
    
    it("should add new field to field set", function (done){
        project.save(function (err, project) {
            Project.findById(project._id,function(err,proj){
                console.log(proj);
                proj.fields.length.should.equal(1);


                Project.findByIdAndUpdate(
                        proj._id
                    ,
                    {
                        $push:{fields: {
                            title: 'Field name2',
                            type: 'text',
                            value: null,
                            require: true
                        }
                        }}
                    ,
                    {upsert:false,safe:true},
                    function(){
                        console.log(project._id);
                        Project.findById(project._id,function(err,proj){
                            console.log(err);
                            console.log(proj);
                            proj.fields.length.should.equal(2);
                            done();
                        })

                    });

            })

         });
    })

});