'use strict';

angular.module('theBossApp').
    directive('topNav',function () {
        return {
            restrict: 'E',

            templateUrl: '/views/directive-templates/layouts/top-nav.html',
            link: function (scope, elem, attrs) {
                scope.title = attrs.title;
            }
        };
    }).
    directive('messages', ['OrderService', function (OrderService) {
        return {
            controller: function ($scope) {
                $scope.showBadge = function () {
                    return $scope.messages && $scope.messages.length > 0;
                }

            },
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/messages.html',
            link: function (scope) {
                scope.messages = [];
                scope.newMessageForm = [{isInline:true, title:'Message', type:'text', require: true, action: {click:scope.sendMessage, title:'Send'}}];

                OrderService.comments().$promise.then(function(data){
                    scope.messages = data;
                })

                scope.sendMessage = function(){
                    if(scope.message){
                        var messageService = new Message({
                            type: 'info',
                            content: scope.message
                        });
                        messageService.$save(function(message){
                            scope.messages.unshift(message);
                            scope.message = null;
                        });
                    }
                }
            }
        };
    }]).
    directive('accessories', ['OrderService', function (OrderService) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/accessories.html',
            scope:{},
            link: function (scope) {
                scope.orders = [];
                OrderService.accessories().$promise.then(function(data){
                    scope.orders = data;
                })

                scope.received = function(order,accessory){
                    accessory.received_by = scope.$root.currentUser.user_id;
                    accessory.date_received = new Date();
                    accessory.received = true;
                    order.$save();
                };
            }
        };
    }]).
    directive('tasks', ['OrderService', function (OrderService) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/tasks.html',
            scope: {
              order: '='
            },
            link: function (scope, element, attrs) {
                if(scope.order){
                    scope.orders = [scope.order];
                }else{
                    OrderService.tasks().$promise.then(function(data){
                        scope.orders = data;
                    });
                }

                scope.setTaskStatus = function(order,form,taskIndex,task,status){
                    task.changed_by = scope.$root.currentUser._id;
                    task.changed_on = new Date();
                    task.status = status;
                    order.$save(function(){
                        if(status=='finish'){
                            form.tasks.splice(taskIndex,1);
                        }
                    });
                };
            }
        };
    }]).
    directive('alerts', ['$http', function ($http) {
        return {
            restrict: 'E',
            //replace: true,
            templateUrl: '/views/directive-templates/layouts/top-nav-alerts.html',
            link: function (scope, element, attrs) {
                if (!attrs.from) {
                    throw new Error('Attribute "from" should be defined.')
                }

                scope.alerts = [];
                $http.get(attrs.from).success(function (data) {
                    scope.alerts = data;
                });
            }
        };
    }]).
    directive('navUser',['Auth','$location', function (Auth, $location) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/top-nav-user.html',
            link: function(scope){
                scope.logout = function () {
                    Auth.logout()
                        .then(function () {
                            $location.path('/login');
                        });
                };
            }
        };
    }]).

    directive('sbSidebar',function () {
        return {
            restrict: 'E',
            //replace: true,
            templateUrl: '/views/directive-templates/layouts/sidebar.html'
        };
    }).
    directive('sbSidebarSearch',function () {
        return {
            restrict: 'E',
            //replace: true,
            templateUrl: '/views/directive-templates/layouts/sidebar-search.html'
        };
    }).
    directive('sbSidebarMenus', ['$http', '$timeout','Auth', function ($http, $timeout,Auth) {
        return {
            restrict: 'A',
            replace: false,
            transclude: false,
            link: function (scope, element, attrs) {
                if (!attrs.menusUrl) {
                    throw new Error('Attribute "menus-url" should be defined.')
                }

                scope.menus = [];

                $http.get(attrs.menusUrl).success(function (data) {
                    scope.menus = data;

                    $timeout(function () {
                        element.metisMenu();
                    });
                });

            }
        };
    }]).
    directive('sbDatatables',function () {
        return {
            restrict: 'A',
            replace: false,
            transclude: false,
            link: function (scope, element) {
                element.dataTable();
            }
        };
    }).
    directive('sbTooltip',function () {
        return {
            restrict: 'A',
            replace: false,
            transclude: false,
            link: function (scope, element) {
                element.tooltip({
                    selector: "[data-toggle=tooltip]",
                    container: "body"
                });
            }
        };
    }).
    directive('sbPopover', function () {
        return {
            restrict: 'A',
            replace: false,
            transclude: false,
            link: function (scope, element) {
                element.find('[data-toggle=popover]').popover();
            }
        };
    });