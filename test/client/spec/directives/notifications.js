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
        httpBackend.expectGET('/views/directive-templates/messages.html').respond(template);
        httpBackend.expectGET('/api/messages/email@email.com').respond({messages:[
            {type:'info',read:false,from:'John Doe',content:'message1',time:new Date()},
            {type:'info',read:false,from:'John Doe',content:'message2',time:new Date()}]});

    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it("should render list of messages loaded from api", function () {
        scope.currentUser = {email:'email@email.com'};
        element = angular.element('<top-nav-messages></top-nav-messages>');
        element = compile(element)(scope);
        scope.$digest();
        httpBackend.flush();
        expect(element.html()).toContain('message1');
    });

    it("should have load more button and when clicked redirect to message path", function () {
        scope.currentUser = {email:'email@email.com'};
        element = angular.element('<top-nav-messages></top-nav-messages>');
        element = compile(element)(scope);
        scope.$digest();
        httpBackend.flush();
        expect(element.find(":<a href=\"#/messages\">Read All Messages</a>")).toBeTruthy();
    });

});
