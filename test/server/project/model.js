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

        // Clear users before testing
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
        project.owner = 'new Owner';
        var projectDup = new Project(project)
        projectDup.save(function (err) {
            should.not.exist(err);
            done();
        });
    });
});