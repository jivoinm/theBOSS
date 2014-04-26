'use strict';

angular.module('theBossApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        //'ngAnimate',
        'ngRoute',
        'ui.bootstrap'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true);

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
    .run(function ($rootScope, $location, Auth) {
        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {
            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path("/login");
            }
        });
    });