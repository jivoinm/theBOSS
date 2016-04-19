'use strict';

angular.module('theBossApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $cookieStore) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          //remove the ignored service alerts
          var cookieKey = 'ignore-services-' + $scope.user.email;
          $cookieStore.remove(cookieKey);

          // Logged in, redirect to home
          $location.path('/calendar');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
