'use strict';

angular.module('theBossApp')
  .controller('UserCtrl', function ($scope, User, $stateParams) {
    	$scope.$parent.pageHeader = 'Users';
        $scope.users = [];
        var query = {};
        if($stateParams.role){
            query.role = $stateParams.role;
        }

        $scope.loadUsers = function(){
	    	if($scope.queryText){
                query.text = $scope.queryText;
            }
	        User.query(query).$promise.then(function(users){
	            $scope.users = users;
	        }, function(err){

	        });
        }

        $scope.loadUsers();
        $scope.changRole =function(user,role) {
        	user.role = role;
        	user.$updateRole();
        };
        $scope.delete = function (user, index){
            user.$delete(function (){
                $scope.users.splice(index,1);
            });
        }
  });
