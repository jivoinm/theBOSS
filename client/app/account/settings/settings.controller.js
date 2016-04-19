'use strict';

angular.module('theBossApp')
  .controller('SettingsCtrl', function ($scope, timeOff, Auth, ModalService, toaster) {
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

    $scope.currentUser = Auth.getCurrentUser();

    timeOff.query(function(timeoffs){
      $scope.timeoffs = timeoffs;
    });

    $scope.delete = function (index, timeoff){
      ModalService.confirm.question('Delete '+timeoff.detail+'?', function(confirmed){
          if(confirmed){
             timeoff.$delete(function(){
               $scope.timeoffs.splice(index,1);
             });
          }else{
            $scope.order.date_required = null;
          }
       })();
    };

    $scope.approveToggle = function(index, timeoff){
      if(timeoff){
        timeoff.$save(function(savedtimeoff){
          toaster.pop('success', 'Success', 'Time off was '+(timeoff.approved ? 'approved': 'declined'));
        });
      }
    }

    $scope.addNewRequest = function(form){
      $scope.submitted = true;
      if(form.$valid) {
        $scope.timeoff = new timeOff($scope.timeoff);
        $scope.timeoff.createdBy = {};
        $scope.timeoff.createdBy.user_id = $scope.currentUser._id;
        $scope.timeoff.createdBy.name = $scope.currentUser.name;
        $scope.timeoff.createdBy.email = $scope.currentUser.email;
        $scope.timeoff.$save(function(data){
          $scope.timeoffs.push(data);
          $scope.timeoff = {};
        });
      }
    };
  });
