'use strict';

describe('Controller: OrdersCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var OrdersCtrl,
        scope,
        $httpBackend,
        orderService,
        userService,
        projectService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _OrderService_,_User_,_ProjectServ_) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.currentUser = {user_id: 'userid'};
        orderService = _OrderService_;
        userService = _User_;
        projectService = _ProjectServ_;

        $httpBackend.expectGET('/api/project').respond([
            {
                "owner": "DelPriore",
                "name": "Kitchen",
                "_id": "535bae8964df54e619deb687",
                "__v": 0,
                "tasks": [
                    {
                        "priority": 2,
                        "title": "Project1 Task2",
                        "duration": "2h",
                        "_id": "535bae8964df54e619deb68a"
                    },
                    {
                        "priority": 1,
                        "title": "Project1 Task1",
                        "duration": "1h",
                        "_id": "535bae8964df54e619deb689"
                    },
                    {
                        "priority": 3,
                        "title": "Project1 Task3",
                        "duration": "1h",
                        "_id": "535bae8964df54e619deb688"
                    }
                ],
                "fields": [
                    {
                        "field_order": 1,
                        "field_title": "Field name1",
                        "field_type": "text",
                        "field_value": "",
                        "field_require": true,
                        "_id": "535bae8964df54e619deb68c",
                        "field_options": []
                    },
                    {
                        "field_order": 2,
                        "field_title": "Field name2",
                        "field_type": "text",
                        "field_value": "",
                        "field_require": true,
                        "_id": "535bae8964df54e619deb68b",
                        "field_options": []
                    }
                ]
            },
            {
                "owner": "DelPriore",
                "name": "Project2",
                "_id": "535bae8964df54e619deb68d",
                "__v": 0,
                "tasks": [
                    {
                        "priority": 2,
                        "title": "Project2 Task2",
                        "duration": "2h",
                        "_id": "535bae8964df54e619deb690"
                    },
                    {
                        "priority": 1,
                        "title": "Project2 Task1",
                        "duration": "1h",
                        "_id": "535bae8964df54e619deb68f"
                    },
                    {
                        "priority": 3,
                        "title": "Project2 Task3",
                        "duration": "1h",
                        "_id": "535bae8964df54e619deb68e"
                    }
                ],
                "fields": [
                    {
                        "field_order": 1,
                        "field_title": "Field name1",
                        "field_type": "text",
                        "field_value": "",
                        "field_require": true,
                        "_id": "535bae8964df54e619deb692",
                        "field_options": []
                    },
                    {
                        "field_order": 2,
                        "field_title": "Field name2",
                        "field_type": "text",
                        "field_value": "",
                        "field_require": true,
                        "_id": "535bae8964df54e619deb691",
                        "field_options": []
                    }
                ]
            }
        ]);

        $httpBackend.expectGET('/api/users/userid/orders').respond([
            {_id: 1, customer: {name:'customer'}, last_updated_on: new Date(),projects:[{project:'id1'},{project:'id2'}]},
            {_id: 2, customer: {name:'customer'}, last_updated_on: new Date(),projects:[{project:'id1'},{project:'id2'}]}
        ]);

        OrdersCtrl = $controller('OrdersCtrl', {
            $scope: scope,
            OrderService: orderService,
            User:userService,
            ProjectServ:projectService
        });
    }));

    it('should attach a list of current user orders to the scope', function () {
        scope.$digest();
        $httpBackend.flush();
        expect(scope.available_projects.length).toBe(2);
    });

    it('should load owner available projects to be available on the scope',function(){
        scope.$digest();
        $httpBackend.flush();
        expect(scope.list.length).toBe(2);
    })

    it('should load project tasks when loadTasks is called', function(){
        scope.order = {_id:'order_id'};
        $httpBackend.expectGET('/api/orders/order_id/tasks').respond([{task:12}]);
        scope.loadTasks();
        scope.$digest();
        $httpBackend.flush();
        expect(scope.tasks.length).toBe(1);
    })

    it('should add selected project to the projects scope list when addProject', function(){
        scope.$digest();
        scope.addProject(scope.available_projects[1]);
        expect(scope.pro)
    })


});
