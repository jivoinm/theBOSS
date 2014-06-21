'use strict';

angular.module('theBossApp')
    .controller('UserCtrl', ['$scope','User', function ($scope, User) {
        $scope.users = [];
        User.query().$promise.then(function(users){
            $scope.users = users;
        }, function(err){

        });
    }]);
