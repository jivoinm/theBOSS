'use strict';

describe('Directive: quickList', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));
    beforeEach(module('app/views/directive-templates/quick-list.html'));

    var template,
        scope,
        $compile,
        $httpBackend;

    beforeEach(inject(function ($rootScope, _$compile_, _$httpBackend_, $templateCache) {
        scope = $rootScope.$new();
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;

        template = $templateCache.get('app/views/directive-templates/quick-list.html');
        $templateCache.put('app/views/directive-templates/quick-list.html', template);
        $httpBackend.expectGET('/views/directive-templates/quick-list.html').respond(template);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should hide the list if nothing in the list', inject(function ($compile) {
        var element = angular.element('<quick-list></quick-list>');
        element = $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.text()).toContain('Nothing to show');
    }));

    function getListOfObjects() {
        return [
            {
                _id: '534a79742dd5fb580bc754bd',
                title: 'Order 1',
                date: '2014-04-13T11:48:04.247Z',
                details: 'Customer1 ordered Project1, Project2'
            },
            {
                _id: '534a79742dd5fb580bc754bd',
                title: 'Order 2',
                date: '2014-04-13T11:48:04.247Z',
                details: 'Customer1 ordered Project1, Project2'
            },
            {
                _id: '534a79742dd5fb580bc754bd',
                title: 'Order 1',
                date: '2014-04-13T11:48:04.247Z',
                details: 'Customer1 ordered Project1, Project2'
            },
            {
                _id: '534a79742dd5fb580bc754bd',
                title: 'Order 1',
                date: '2014-04-13T11:48:04.247Z',
                details: 'Customer1 ordered Project1, Project2'
            },
            {
                _id: '534a79742dd5fb580bc754bd',
                title: 'Order 1',
                date: '2014-04-13T11:48:04.247Z',
                details: 'Customer1 ordered Project1, Project2'
            }
        ];
    }

    it("should render the list when a scope has set the list property as an array", function () {
        scope.list = getListOfObjects();
        var element = angular.element('<quick-list></quick-list>');
        element = $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.find(":Customer1 ordered")).toBeTruthy();
    });
    it("should not show search if not set on directive", function(){
        var element = angular.element('<quick-list></quick-list>');
        element = $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.find("#search_concept").length).toBe(0);
    });
    it("should show add new button on the header if editable form is set", function(){
        var element = angular.element('<quick-list editableForm="[]"></quick-list>');
        element = $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.find("#add").length).toBe(1);
    });
});
