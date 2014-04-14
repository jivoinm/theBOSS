'use strict';

describe('Directive: sbAdminModule', function () {

    // load the directive's module
    beforeEach(module('theBossApp'));

    beforeEach(module('app/views/directive-templates/layouts/top-nav.html',
        'app/views/directive-templates/layouts/messages.html',
        'app/views/directive-templates/layouts/tasks.html'
    ));

    var scope, compile, httpBackend, template;

    beforeEach(inject(function ($rootScope, $compile, _$httpBackend_, $templateCache) {
        scope = $rootScope.$new();
        compile = $compile;
        httpBackend = _$httpBackend_;
        template = $templateCache;
    }));


    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe("top-nav tests", function () {

        var topNavTemplate, element;
        beforeEach(function () {
            topNavTemplate = template.get('app/views/directive-templates/layouts/top-nav.html');
            template.put('app/views/directive-templates/layouts/top-nav.html', topNavTemplate);
            httpBackend.expectGET('/views/directive-templates/layouts/top-nav.html').respond(topNavTemplate);
        });

        it('should render title beside the logo', function () {
            element = angular.element('<top-nav title="\'theBOSS Admin\'"></top-nav>');
            compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.text()).toContain('theBOSS Admin');
        });

    });

    describe("messages test", function () {
        var element, topNavMessages;
        beforeEach(function () {
            topNavMessages = template.get('app/views/directive-templates/layouts/messages.html');
            httpBackend.expectGET('/views/directive-templates/layouts/messages.html').respond(topNavMessages);

            element = angular.element('<messages></messages>');
        });

        it("should render list of messages loaded from api", function () {
            httpBackend.expectGET('/api/messages').respond([
                {type: 'info', read: false, from: 'John Doe', content: 'message1', time: new Date()},
                {type: 'info', read: false, from: 'John Doe', content: 'message2', time: new Date()}
            ]
            );

            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.html()).toContain('message1');
        });

        it("should have load more button and when clicked redirect to message path", function () {
            httpBackend.expectGET('/api/messages').respond([
                {type: 'info', read: false, from: 'John Doe', content: 'message1', time: new Date()},
                {type: 'info', read: false, from: 'John Doe', content: 'message2', time: new Date()}
            ]
            );
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.find(":Read All Messages")).toBeTruthy();
        });

        it("should show badge with number of messages", function () {
            httpBackend.expectGET('/api/messages').respond([
                {type: 'info', read: false, from: 'John Doe', content: 'message1', time: new Date()},
                {type: 'info', read: false, from: 'John Doe', content: 'message2', time: new Date()}
            ]
            );
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.find(".badge").text()).toBe("2");
        });

        it("should not show badge if no messages", function () {
            httpBackend.expectGET('/api/messages').respond({messages: []});
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            //console.log(element.find(".badge"));
            expect(element.find('.badge').eq(0).hasClass('ng-hide')).toBeTruthy();
        });
    });

    describe("top-nav-tasks test", function () {
        var element, topNavTasks;
        beforeEach(function () {
            topNavTasks = template.get('app/views/directive-templates/layouts/tasks.html');
            httpBackend.expectGET('/views/directive-templates/layouts/tasks.html').respond(topNavTasks);

            element = angular.element('<tasks></tasks>');
        });

        it("should render list of tasks loaded from api", function () {
            httpBackend.expectGET('/api/tasks').respond([
                {user: 'John Doe', name: 'Task name1', min: 0, max: 100, now: 40, status: 'success'},
                {user: 'John Doe', name: 'Task name2', min: 0, max: 100, now: 60, status: 'info'},
                {user: 'John Doe', name: 'Task name3', min: 0, max: 100, now: 10, status: 'warning'},
                {user: 'John Doe', name: 'Task name3', min: 0, max: 100, now: 10, status: 'danger'}
            ]);
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.html()).toContain('John Doe');
            expect(element.html()).toContain('Task name1');
        });

        it("should have load more button and when clicked redirect to message path", function () {
            httpBackend.expectGET('/api/tasks').respond([
                {user: 'John Doe', name: 'Task name1', min: 0, max: 100, now: 40, status: 'success'}
            ]);
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.find(":Read All Messages")).toBeTruthy();
            expect(element.find("a[href='#/tasks']")).toBeTruthy();
        });

        it("should show badge with number of messages", function () {
            httpBackend.expectGET('/api/tasks').respond([
                {user: 'John Doe', name: 'Task name1', min: 0, max: 100, now: 40, status: 'success'},
                {user: 'John Doe', name: 'Task name2', min: 0, max: 100, now: 60, status: 'info'},
                {user: 'John Doe', name: 'Task name3', min: 0, max: 100, now: 10, status: 'warning'},
                {user: 'John Doe', name: 'Task name3', min: 0, max: 100, now: 10, status: 'danger'}
            ]);
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.find(".badge").text()).toBe("4");
        });

        it("should not show badge if no messages", function () {
            httpBackend.expectGET('/api/tasks').respond([]);
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            expect(element.find('.badge').eq(0).hasClass('ng-hide')).toBeTruthy();
        });

        it("should calculate percentage based on the task max and now", function () {
            httpBackend.expectGET('/api/tasks').respond([]);
            element = compile(element)(scope);
            scope.$digest();
            httpBackend.flush();
            var percentage = scope.getWorkedPercentage({user: 'John Doe', name: 'Task name1', min: 0, max: 100, now: 25, status: 'success'});
            expect(percentage).toBe(25);
        });
    });
});
