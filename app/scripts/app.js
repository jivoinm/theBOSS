'use strict';

angular.module('theBossApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.calendar',
        'ui.bootstrap',
        'ui.router',
        'ngAnimate',
        'toaster',
        'chieffancypants.loadingBar',
        'ngAnimate',
        'ngDragDrop',
        'angularFileUpload',
        'angularMoment',
        'underscore'
    ])
    .config( ['$routeProvider', '$locationProvider', '$httpProvider',function($routeProvider, $locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true);
        var access = routingConfig.accessLevels;
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main',
                controller: 'MainCtrl'
            })
            .when('/index', {
                templateUrl: 'partials/index',
                controller: 'PublicCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl',
                authenticate: true,
                resolve: {
                    user: ['User', function (User){ return new User({role:'user'});}]
                }
            })
            .when('/signup/:id', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl',
                authenticate: true,
                resolve: {
                    user: ['User', '$route', function (User, $route){
                        return User.load({id: $route.current.params.id}).$promise.then(function(user){
                            return user;
                        })

                    }]
                }
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'SettingsCtrl',
                authenticate: true
            })
            .when('/users', {
                templateUrl: 'partials/users',
                controller: 'UserCtrl',
                authenticate: true
            })
            .when('/users/:role', {
                templateUrl: 'partials/users',
                controller: 'UserCtrl',
                authenticate: true
            })
            .when('/orders', {
                templateUrl: 'partials/orders',
                controller: 'OrdersCtrl'
            })
            .when('/orders/:status', {
                templateUrl: 'partials/orders',
                controller: 'OrdersCtrl'
            })
            .when('/calendar', {
                templateUrl: 'partials/calendar',
                controller: 'CalendarCtrl',
            })
            .when('/calendar/:status', {
                templateUrl: 'partials/calendar',
                controller: 'CalendarCtrl',
            })
            .when('/order-details/:orderId', {
                templateUrl: 'partials/order-details',
                controller: 'OrderDetailsCtrl'
            })
            .when('/order', {
                templateUrl: 'partials/order',
                controller: 'OrderCtrl',
                resolve: {
                    order: ['OrderService', function (OrderService){ return new OrderService();}]
                }
            })
            .when('/order/:id', {
                templateUrl: 'partials/order',
                controller: 'OrderCtrl',
                resolve: {
                    order: ['OrderService', '$route', function (OrderService, $route){
                        return OrderService.get({orderId: $route.current.params.id}).$promise.then(function(order){
                            //load order
                            return order;
                        })
                    }]
                }
            })
            .otherwise({
                redirectTo: '/main'
            });

        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'response': function (response) {
                    return response || $q.when(response);
                },
                'responseError': function (response) {
                    if (response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    }])
    .config(['$httpProvider', function ($httpProvider) {
      var logsOutUserOn401 = ['$q', '$location', function ($q, $location) {
        var success = function (response) {
          return response;
        };

        var error = function (response) {
          if (response.status === 401) {
            //redirect them back to login page
            $location.path('/login');

            return $q.reject(response);
          } 
          else {
            return $q.reject(response);
          }
        };

        return function (promise) {
          return promise.then(success, error);
        };
      }];

      $httpProvider.responseInterceptors.push(logsOutUserOn401);
   }]).constant('theBossSettings',{
        orderChangedEvent: 'order-changed',
        previewModeEvent: 'preview-mode',
        timeZone: '-05:00',
        taskStatuses: {
            New: 'new',
            InProgress: 'in progress',
            Finished: 'finished',
            Blocked: 'blocked'
        }
    })
    .run(['$rootScope', '$location', 'Auth', 'roles', function ($rootScope, $location, Auth, roles) {
        var routesThatDontRequireAuth = ['/login'];
        var routesThatForAdmins = ['/users'];

        var routeClean = function (route) {
            return _.find(routesThatDontRequireAuth,
              function (noAuthRoute) {
                return route.indexOf(noAuthRoute) > -1;
              });
        };

        var routeAdmin = function(route) { 
            return _.find(routesThatForAdmins,
              function (routeForAdmin) {
                return route.indexOf(routeForAdmin) > -1;
                });
        }

        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (!routeClean($location.url()) && !Auth.isLoggedIn()) {
              $location.path('/login');
            } else if (routeAdmin($location.url()) && !roles.validateRoleAdmin()) {
              $location.path('/error');
            }
        });
    }]);
