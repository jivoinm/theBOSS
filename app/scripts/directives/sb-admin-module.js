'use strict';

angular.module('theBossApp').
    directive('topNav',function () {
        return {
            restrict: 'E',
            scope: {
                title: '='
            },
            templateUrl: '/views/directive-templates/layouts/top-nav.html',
            link: function (scope) {
                if (scope.$parent.currentUser) {
                    scope.owner = scope.$parent.currentUser.owner;
                }
            }
        };
    }).
    directive('messages', ['Message', function (Message) {
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
                Message.query().$promise.then(function(data){
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
    directive('tasks', ['OrderService', function (OrderService) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/tasks.html',
            link: function (scope, element, attrs) {
                scope.orders = [];
                OrderService.query().$promise.then(function(data){
                    scope.orders = data;
                });
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
    directive('navUser',function () {
        return {
            restrict: 'E',
            //replace: true,
            templateUrl: '/views/directive-templates/layouts/top-nav-user.html'
        };
    }).
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
    directive('sbSidebarMenus', ['$http', '$timeout', function ($http, $timeout) {
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