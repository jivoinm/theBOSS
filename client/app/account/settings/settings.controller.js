'use strict';

angular.module('theBossApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
    $scope.timeoff = {};
    $scope.currentUser = Auth.getCurrentUser();

    $scope.addNewRequest = function(form){
      $scope.submitted = true;
      if(form.$valid) {
        $scope.currentUser.timeoffs.push($scope.timeoff);
        $scope.currentUser.$save(function(result){
          console.log(result);
        });
      }
    };
  });
