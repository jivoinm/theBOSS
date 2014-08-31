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
        'ngGrid',
        'underscore'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
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
                authenticate: true
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

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'response': function (response) {
//                    if (response.status === 401) {
//                        console.log("Response 401");
//                    }
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
    }).config(function ($httpProvider) {
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
   }).constant('theBossSettings',{
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
    .run(function ($rootScope, $location, Auth, roles) {
        // enumerate routes that don't need authentication
        var routesThatDontRequireAuth = ['/login'];
        var routesThatForAdmins = ['/users'];

        // check if current location matches route  
        var routeClean = function (route) {
            return _.find(routesThatDontRequireAuth,
              function (noAuthRoute) {
                return _.str.startsWith(route, noAuthRoute);
              });
        };

        var routeAdmin = function(route) { 
            return _.find(routesThatForAdmins,
              function (routeForAdmin) {
                return _.str.startsWith(route, routeForAdmin);
                });
        }


        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // if route requires auth and user is not logged in
            if (!routeClean($location.url()) && !Auth.isLoggedIn()) {
              // redirect back to login
              $location.path('/login');
            } else if (routeAdmin($location.url()) && !roles.validateRoleAdmin()) {
              // redirect to error page
              $location.path('/error');
            }
        });
    });
