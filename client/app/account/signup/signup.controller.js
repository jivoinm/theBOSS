'use strict';

angular.module('theBossApp')
  .controller('SignupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
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
                  $location.path('/user');
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

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
