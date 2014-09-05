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

    directive('accessories', ['OrderService','$timeout', function (OrderService, $timeout) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/accessories.html',
            scope:{},
            link: function (scope) {
                scope.orders = [];
                var secondsToWaitBeforeSave = 2;
                var timeout = null;
                OrderService.accessories().$promise.then(function(data){
                    scope.orders = data;
                });

                var saveUpdates = function(newVal) {
                    console.log("Tried to save updates to item #" + (newVal) + " but the form is invalid.");
                };
            }
        };
    }]).
    directive('tasks', ['OrderService','$location', '_', function (OrderService, $location, _) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/tasks.html',
            scope: true,
            controller: function ($scope) {
                if($scope.order){
                    $scope.orders = [$scope.order];
                }else{
                    OrderService.tasks({}).$promise.then(function(data){
                        $scope.orders = data;
                    });
                }

                $scope.setTaskStatus = function(order,form,taskIndex,task,status){
                    task.changed_by = $scope.$root.currentUser._id;
                    task.changed_on = new Date();
                    task.status = status;
                    
                    //if all tasks are finished then remove from the list
                    return order.$save(function(savedOrder){
                        if(savedOrder.status === 'finished'){
                            order.forms = _.without(order.forms, _.findWhere(order.forms, {_id: form._id}));
                        }
                    });
                };

                $scope.loadOrder = function(id){
                    $location.path('/order/' + id);
                }
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
    }).

    directive('sbUrlActive',['$location', function ($location) {
        return{
            restrict: 'A',
            link: function (scope, element) {
                if(element[0].hash){
                    var path = element[0].hash.replace('#','');
                    if($location.path() ===  path){
                        element.addClass('active');
                    }else{
                        element.removeClass('active');
                    }
                }
            }
        }

    }]).
    directive('sbUrlActiveMenu',['$location', function ($location) {
        return{
            restrict: 'A',
            link: function (scope, element) {
                if(element[0].hash){
                    var path = element[0].hash.replace('#','');
                    console.log($location.path(), element.parent());
                    if($location.path() ===  path){
                        element.parent().addClass('active');
                    }else{
                        element.parent().removeClass('active');
                    }
                }
            }
        }

    }]);