'use strict';

angular.module('theBossApp')
    .controller('SignupCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {
        $scope.user = {role:'user'};
        $scope.errors = {};

        $scope.register = function (form) {
            $scope.submitted = true;

            if (form.$valid) {
                var user = {
                    owner: 'DelPriore',
                    name: $scope.user.name,
                    email: $scope.user.email,
                    role: $scope.user.role,
                    password: $scope.user.password
                };

                Auth.createUser(user)
                    .then(function () {
                        // Account created, redirect to home
                        $location.path('/users');
                    })
                    .catch(function (err) {
                        err = err.data;
                        $scope.errors = {};

                        // Update validity of form fields that match the mongoose errors
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.message;
                        });
                    });
            }
        };
    }]);