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

    it('should delete a form field', function (){
        $httpBackend.expectGET('/api/forms/module').respond([{_id:'id', fields:[{_id:'fieldid'}]}]);
        $httpBackend.expectDELETE('/api/forms/id/field/field_id').respond({title:'title'});
        Form.get({module:'module'}).$promise.then(function(forms){
            console.log(forms);
            forms[0].$deleteField({fieldId:'field_id'});
        });

        $httpBackend.flush();
    });

});
