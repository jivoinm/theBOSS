'use strict';

angular.module('theBossApp').
    directive('topNav',function () {
        return {
            restrict: 'E',
            scope: {
                title: '='
            },
            templateUrl: '/views/directive-templates/layouts/top-nav.html',
            link: function (scope, element, attr) {
                if (scope.$parent.currentUser) {
                    scope.owner = scope.$parent.currentUser.owner;
                }
            }
        };
    }).
    directive('messages', ['$http', function ($http) {
        return {
            controller: function ($scope) {
                $scope.showBadge = function () {
                    return $scope.messages && $scope.messages.length > 0;
                }

            },
            restrict: 'E',
            //replace: true,
            templateUrl: '/views/directive-templates/layouts/messages.html',
            link: function (scope, element, attrs) {
                scope.messages = [];
                $http.get('/api/messages').success(function (data) {
                    scope.messages = data;
                });
            }
        };
    }]).
    directive('tasks', ['$http', function ($http) {
        return {
            controller: function ($scope) {
                $scope.getWorkedPercentage = function (task) {
                    return task ? Math.round(((task.now - task.min) / (task.max - task.min) * 100)) : 0;
                }
            },
            restrict: 'E',
            //replace: true,
            templateUrl: '/views/directive-templates/layouts/tasks.html',
            link: function (scope, element, attrs) {
                scope.tasks = [];
                $http.get('/api/tasks').success(function (data) {
                    scope.tasks = data;
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