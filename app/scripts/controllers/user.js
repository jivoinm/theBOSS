'use strict';

angular.module('theBossApp')
    .controller('UserCtrl', ['$scope','User', '$routeParams', function ($scope, User, $routeParams) {
    	$scope.$parent.pageHeader = 'Users';
        $scope.users = [];
        var query = {};
        if($routeParams.role){
            query.role = $routeParams.role;
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

    }]);
