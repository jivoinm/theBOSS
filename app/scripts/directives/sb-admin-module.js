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

    directive('accessories', ['OrderService','toaster', function (OrderService, toaster) {
        return {
            restrict: 'E',
            templateUrl: '/views/directive-templates/layouts/accessories.html',
            scope: false,
            link: function (scope) {
                scope.orders = [];
                scope.notreceived = {received:false};
                OrderService.accessories().$promise.then(function(data){
                    scope.orders = data;
                });

                scope.saveUpdates = function(index,order,accessory) {
                    if(accessory.items_received) {
                        accessory.received = accessory.items_received >= accessory.quantity;
                        accessory.date_received = new Date();
                        order.$save(function(){
                            if(accessory.received){
                                order.ordered_accessories.splice(index,1);    
                                toaster.pop('success', "Success", 'Received all '+ accessory.description);
                            }else{
                                toaster.pop('success', "Success", 'Updated items received for '+ accessory.description);
                            }
                            
                        });
                    }else{
                         toaster.pop('error', "Error", 'Nothing was set as received.');
                    }
                    
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

                var selectedTab;

                $scope.setTaskStatus = function(order,orderIndex,form,formIndex,task,status, e){
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    task.changed_by = $scope.$root.currentUser._id;
                    task.changed_on = new Date();
                    task.status = status;
                    
                    //if all tasks are finished then remove from the list
                    return order.$save(function(savedOrder){
                        order = savedOrder;
                        if(savedOrder.status === 'finished'){
                            $scope.orders.splice(orderIndex,1);
                        }else{
                            order.forms[formIndex].active = true;
                        }
                        
                    });
                };

                $scope.loadOrder = function(id){
                    $location.path('/order/' + id);
                }

                $scope.status = {
                    isFirstOpen: true,
                    isFirstDisabled: false,
                    oneAtATime: true
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