'use strict';
var Form, User, app, mongoose, request, server, should, form, agent;

should = require("should");
app = require("../../../server");
mongoose = require("mongoose");
Form = mongoose.model("Form");
User = mongoose.model("User");
request = require("supertest");
agent = request.agent(app);

describe('Form controller', function () {
    beforeEach(function (done) {
        User.create({
            provider: 'local',
            name: 'Fake User',
            email: 'user@user.com',
            password: 'pass11',
            owner:'MirceaSoft'
        }, function (){
            form = new Form({
                owner: 'Owner1',
                form_name: 'Form Name',
                fields:[
                    {
                        order: 1,
                        title: 'Field name1',
                        type: 'text',
                        value: '',
                        require: true
                    }
                ]
            });
            Form.remove().exec();
            form.save(function(){
                //login
                agent
                    .post('/api/session')
                    .send({email: 'user@user.com', password: 'pass11'})
                    .end(function (err, res) {
                        agent.saveCookies(res);
                        done();
                    });
            });
        });
    });

    it('should create new project on post', function (done) {
        agent
            .post('/api/forms')
            .send({
                owner: 'owner 1',
                form_name: 'Form Name that not exists',
                fields:[
                    {
                        order: 1,
                        title: 'Field name1',
                        type: 'text',
                        value: '',
                        require: true
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
        form.form_name = 'project name changed';
        agent
            .post('/api/forms/'+form._id)
            .send(form)
            .end(function (err, res) {
                (form.name === res.body.name).should.be.true;
                done();
            });
    });

    xit("should be able to add new field to existing form", function (done) {
        agent
            .post('/api/forms/'+form._id+"/field")
            .send({
                field: {
                    title: 'Field name1',
                    type: 'text',
                    value: null,
                    require: true
                }
            })
            .end(function (err, res) {
                should.not.exists(err);
                should.exists(res.body.fields[1]);
                done();
            });

    });

});
