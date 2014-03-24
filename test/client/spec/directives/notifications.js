'use strict';

describe('Directive: notifications', function () {

    // load the directive's module
    beforeEach(module('theBossApp','app/views/directive-templates/messages.html'));

    var element,scope,compile,httpBackend, template;

    beforeEach(inject(function ($rootScope,$compile,_$httpBackend_,$templateCache) {
        scope = $rootScope.$new();
        compile = $compile;
        httpBackend = _$httpBackend_;
        template = $templateCache.get('app/views/directive-templates/messages.html');
        $templateCache.put('app/views/directive-templates/messages.html',template);

    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });



    it("should render list of messages loaded from api", function () {
        httpBackend.expectGET('/views/directive-templates/messages.html').respond(template);
        httpBackend.expectGET('/api/messages/email@email.com').respond({messages:[
            {type:'info',read:false,from:'John Doe',content:'message1',time:new Date()},
            {type:'info',read:false,from:'John Doe',content:'message2',time:new Date()}]});

        scope.currentUser = {email:'email@email.com'};
        element = angular.element('<top-nav-messages></top-nav-messages>');
        element = compile(element)(scope);
        scope.$digest();
        httpBackend.flush();
        expect(element.html()).toContain('message1');
    });


});
