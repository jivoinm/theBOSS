'use strict';

describe('Service: Form', function () {

    // load the service's module
    beforeEach(module('theBossApp'));

    // instantiate service
    var Form,
        $httpBackend;
    beforeEach(inject(function (_FormService_, _$httpBackend_) {
        Form = _FormService_;
        $httpBackend = _$httpBackend_;
    }));

    it('should put new field', function () {
        $httpBackend.expectPUT('/api/forms/form_id/field',{title: 'title',type:'text'}).respond({title:'title'});
        Form.addField({id:'form_id'},{title: 'title',type:'text'});
        $httpBackend.flush();
    });

});
