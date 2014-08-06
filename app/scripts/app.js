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
                controller: 'MainCtrl',
                authenticate: true
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
                controller: 'SignupCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'SettingsCtrl',
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
                        console.log("Response " + response.status);
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .constant('theBossSettings',{
        orderChangedEvent: 'order-changed',
        previewModeEvent: 'preview-mode',
        timeZone: '-05:00'
    })
    .run(function ($rootScope, $location, Auth) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path("/login");
            }
        });
    });
