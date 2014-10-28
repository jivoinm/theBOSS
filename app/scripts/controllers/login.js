'use strict';

angular.module('theBossApp')
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {
        $scope.user = {};
        $scope.errors = {};

        $scope.remember = false;
        
        // if ($remember('username') && $remember('password') ) {
        //     $scope.remember = true;
        //     $scope.user.username = $remember('username');
        //     $scope.user.password = $remember('password');
        // }
        // $scope.rememberMe = function() {
        //     if ($scope.remember) {
        //         $remember('username', $scope.user.username);
        //         $remember('password', $scope.user.password);
        //     } else {
        //         $remember('username', '');
        //         $remember('password', '');
        //     }
        // };

        $scope.login = function (form) {
            $scope.submitted = true;

            if (form.$valid) {
                Auth.login({
                    email: $scope.user.email,
                    password: $scope.user.password
                })
                    .then(function () {
                        // Logged in, redirect to home
                        $location.path('/');
                    })
                    .catch(function (err) {
                        err = err.data;
                        $scope.errors.other = err.message;
                    });
            }
        };
    }]);