'use strict';
var Form, User, app, mongoose, request, server, should, form, agent;

should = require("should");
app = require("../../../server");
mongoose = require("mongoose");
Form = mongoose.model("Form");
User = mongoose.model("User");
request = require("supertest");
agent = request.agent(app);
var Helper = require("../../model-helper");
var helper = new Helper('DelPriore');

describe('Form controller', function () {
    beforeEach(function (done) {
        helper.clearAll(function(){
            helper.addForm('Module1','Form1',[
                    {
                        order: 1,
                        title: 'Field1',
                        type: 'text',
                        require: true
                    }
                ])
                .then(function(_form_){
                    form = _form_;
                    helper.addUser('User','user@user.com','test1234').then(
                        function(user){
                            //login
                            agent
                                .post('/api/session')
                                .send({email: 'user@user.com', password: 'test1234'})
                                .end(function (err, res) {
                                    agent.saveCookies(res);
                                    done();
                                });

                        }, function (err){
                            console.log(err);
                        });

                })
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
        form.formName = 'project name changed';
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
