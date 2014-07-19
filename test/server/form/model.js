'use strict';

var should = require('should'),
    mongoose = require('mongoose'),
    Form = mongoose.model('Form');

var Helper = require("../../model-helper");
var helper = new Helper('DelPriore');

var form;
describe('Form server tests', function () {
    beforeEach(function (done) {
        helper.clearAll(function(){
            helper.addForm('Module1','Form1').then(function(_form_){
                form = _form_;
                done();
            });
        })

    });

    it("should error if Form name already exists on the same owner", function (done) {
        helper.addForm('Module1','Form1').then(function(_form_){
            should.not.exist(_form_);
        }, function (err) {
            should.exist(err);
            done();
        });
    });

    it("should not error if Form name don't exist on the different owner", function (done) {
        var FormDup = new Form({
            owner: 'Owner2',
            formName: 'Form1',
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
        FormDup.save(function (err) {
            // console.log(err);
            should.not.exist(err);
            done();
        });
    });

    it("should return only owner Forms", function (done) {
        var newForm = new Form();
        newForm.formName = 'New Form Name';
        newForm.owner = 'new Owner added1';
        newForm.save(function () {
            //create third Form
            var newForm = new Form();
            newForm.formName = 'New Form Name';
            newForm.owner = 'new Owner added2';
            newForm.save(function () {
                Form.findOwnerForms('new Owner added1', function (err, Forms) {
                    should.not.exist(err);
                    (Forms.length === 1).should.be.true;
                    done();
                })
            });
        });
    });

    it("should be able to add and save Form task", function (done) {
        Form.findByIdAndUpdate(form._id,{
            '$pushAll': {'tasks': [{priority: 1, title: 'Task1', duration: '1h'},{priority: 2, title: 'Task2', duration: '1h'}]}
        }, {safe:true, upsert:true},function(err, Form){
            should.not.exist(err);
            Form.tasks.length.should.equal(2);
            done();
        })

    });

});