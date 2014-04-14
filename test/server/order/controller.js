'use strict';
var Project, app, mongoose, request, server, should, project, agent;

should = require("should");
app = require("../../../server");
mongoose = require("mongoose");
Project = mongoose.model("Project");
request = require("supertest");
agent = request.agent(app);

describe('Order controller', function () {
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
        Project.remove().exec();
        project.save(done);
    });

    it('should create new project on post', function (done) {
        agent
            .post('/api/project')
            .send({
                owner: 'owner 1',
                name: 'Project Name that not exists',
                fields: [
                    {
                        field_order: 1,
                        field_title: 'Field name1',
                        field_type: 'text',
                        field_value: '',
                        field_require: true
                    }
                ]
            })
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body._id);
                done();
            });
    });

    it("should update existing project on post", function (done) {
        project.name = 'project name changed';
        agent
            .post('/api/project')
            .send(project)
            .end(function (err, res) {
                (project.name === res.body.name).should.be.true;
                done();
            });
    });

});
