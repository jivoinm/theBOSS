'use strict';

describe('Controller: OrdersCtrl', function () {

    // load the controller's module
    beforeEach(module('theBossApp'));

    var OrdersCtrl,
        scope,
        $httpBackend,
        orderService,
        userService,
        formService;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, _OrderService_,_User_,_FormService_) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        scope.currentUser = {user_id: 'userid'};
        orderService = _OrderService_;
        userService = _User_;
        formService = _FormService_;

        $httpBackend.expectGET('/api/project/orders').respond([
            {
                "owner": "DelPriore",
                "name": "Kitchen",
                "_id": "535cebe074417865404669be",
                "__v": 0,
                "tasks": [
                    {
                        "priority": 2,
                        "title": "Project1 Task2",
                        "duration": "2h",
                        "_id": "535cebe074417865404669c1",
                        "status_options": [
                            "status1",
                            "status2",
                            "status3"
                        ]
                    },
                    {
                        "priority": 1,
                        "title": "Project1 Task1",
                        "duration": "1h",
                        "_id": "535cebe074417865404669c0",
                        "status_options": [
                            "status1",
                            "status2",
                            "status3"
                        ]
                    },
                    {
                        "priority": 3,
                        "title": "Project1 Task3",
                        "duration": "1h",
                        "_id": "535cebe074417865404669bf",
                        "status_options": [
                            "status1",
                            "status2"
                        ]
                    }
                ],
                "field_sets": [
                    {
                        "title": "Materials",
                        "_id": "535cebe074417865404669c2",
                        "fields": [
                            {
                                "order": 1,
                                "title": "Field name1",
                                "type": "text",
                                "default_value": "default value",
                                "require": true,
                                "_id": "535cebe074417865404669c4",
                                "show_options": []
                            },
                            {
                                "order": 2,
                                "title": "Field name2",
                                "type": "text",
                                "require": true,
                                "_id": "535cebe074417865404669c3",
                                "show_options": []
                            }
                        ],
                        "show_options": []
                    }
                ]
            },
            {
                "owner": "DelPriore",
                "name": "Project2",
                "_id": "535cebe074417865404669c5",
                "__v": 0,
                "tasks": [
                    {
                        "priority": 2,
                        "title": "Project1 Task2",
                        "duration": "2h",
                        "_id": "535cebe074417865404669c8",
                        "status_options": [
                            "status1",
                            "status2",
                            "status3"
                        ]
                    },
                    {
                        "priority": 1,
                        "title": "Project1 Task1",
                        "duration": "1h",
                        "_id": "535cebe074417865404669c7",
                        "status_options": [
                            "status1",
                            "status2",
                            "status3"
                        ]
                    },
                    {
                        "priority": 3,
                        "title": "Project1 Task3",
                        "duration": "1h",
                        "_id": "535cebe074417865404669c6",
                        "status_options": [
                            "status1",
                            "status2"
                        ]
                    }
                ],
                "field_sets": [
                    {
                        "title": "Materials",
                        "_id": "535cebe074417865404669c9",
                        "fields": [
                            {
                                "order": 1,
                                "title": "Field name1",
                                "type": "text",
                                "default_value": "default value",
                                "require": true,
                                "_id": "535cebe074417865404669cb",
                                "show_options": []
                            },
                            {
                                "order": 2,
                                "title": "Field name2",
                                "type": "text",
                                "require": true,
                                "_id": "535cebe074417865404669ca",
                                "show_options": []
                            }
                        ],
                        "show_options": []
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
            FormService:formService
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
