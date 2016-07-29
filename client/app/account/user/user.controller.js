'use strict';

angular.module('theBossApp')
  .controller('UserCtrl', function ($scope, User, Auth, $stateParams, roles, ModalService, toaster, userGroup) {
    	$scope.$parent.pageHeader = 'Users';
        $scope.users = [];
        $scope.allRoles = roles.allRoles();
        $scope.groups = [];

        $scope.user_fields = [
            {title:'Name', type:'text', require: true},
            {title:'Email', type:'email', require: true},
            {title:'Password', type:'password', require: true},
            {title:'Role', type:'select', show_options: $scope.allRoles, require: true}
          ];

        $scope.group_fields = [
            {title:'Name', type:'text', require: true}
          ];

          $scope.password_fields = [
            {title:'New Password', type:'text', require: true}
          ];
        
        var query = {};
        if($stateParams.role){
            query.role = $stateParams.role;
        }

        if($stateParams.group){
            query.group = $stateParams.group;
        }

        $scope.loadUsers = function(){
	    	  if($scope.queryText){
                query.text = $scope.queryText;
          }

          User.query(query).$promise.then(function(users){
	            $scope.users = users;
	            }, function(err){
              console.log(err);
	        });
        };

        $scope.loadGroups = function (){
            $scope.groups = [];
            userGroup.query().$promise.then(function(groups){
                groups.forEach(function(group){
                    $scope.groups.push(group.name);
                });
                
            }, function(err){
                console.log(err);
            });
        };

        $scope.loadUsers();
        $scope.loadGroups();
        $scope.changRole =function(user,role) {
        	user.role = role;
        	user.$updateRole();
        };
        
        $scope.delete = function (user, index){
            if(!confirm('Are you sure you want to delete user '+user.name+'?'))
            { 
                return; 
            }
            user.$delete(function (){
                $scope.users.splice(index,1);
            });
        };

        $scope.status = {
            isopen: false
        };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };

        $scope.selectGroup = function(user, group){
            if(user.groups.indexOf(group) === -1){
                user.groups.push(group);
            }else{
                user.groups.splice(user.groups.indexOf(group), 1);
            }
            user.$updateGroups();
        };

        $scope.addNewUser = function(){
            ModalService.show.modalFormDialog('Add new User',
                $scope.user_fields, function(model){
                    if(model && model.name && model.email && model.password && model.role){
                        var user = new User(model);
                        user.owner = Auth.getCurrentUser().owner;
                        user.$save(function(){
                            toaster.pop('success', 'User was saved with success');
                            $scope.loadUsers();
                        }, function(err) {
                            toaster.pop('error', 'There was an error saving user on server, '+err.data.message);
                        });
                        model = null;

                        return true;
                    }
                })();

        };

        $scope.addNewGroup = function(){
            ModalService.show.modalFormDialog('Add new Group/Department',
                $scope.group_fields, function(model){
                    if(model && model.name){
                        var group = new userGroup(model);
                        group.$save(function(){
                            toaster.pop('success', 'Group was saved with success');
                            $scope.loadGroups();
                        }, function(err) {
                            toaster.pop('error', 'There was an error saving group on server, '+err.data.message);
                        });
                        model = null;
                        return true;
                    }
                })();
        };

         $scope.resetPassword = function(user){
            if(!user) { return; }
            ModalService.show.modalFormDialog('Reset '+user.name+' password',
                $scope.password_fields, function(model){
                    if(model && model.new_password){
                        user.newPassword = model.new_password;
                        user.$resetPassword(function(){
                            toaster.pop('success', 'User was saved with success');
                            $scope.loadUsers();
                        }, function(err) {
                            toaster.pop('error', 'There was an error saving user on server, '+err.data.message);
                        });
                        model = null;
                        return true;
                    }
                })();

        };


  });
