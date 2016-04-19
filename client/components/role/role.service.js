'use strict';

angular.module('theBossApp')
  .service('roles', function($rootScope, Auth) {
  	var adminRoles = ['admin'];
  	var secondAdminRoles = ['sales rep'];
  	var otherRoles = ['user', 'worker'];
  	return {
  		validateRoleAdmin: function (currentUser) {
  			currentUser = (currentUser || $rootScope.currentUser);
  			return currentUser ? _.contains(adminRoles, currentUser.role) || _.contains(secondAdminRoles, currentUser.role)  : false;
  		},
      validateServiceApproval: function (currentUser) {
  			currentUser = (currentUser || $rootScope.currentUser);
  			return currentUser ? _.contains(adminRoles, currentUser.role) || _.contains(secondAdminRoles, currentUser.role) : false;
  		},
  		validateRoleOther: function (currentUser) {
  			currentUser = (currentUser || $rootScope.currentUser);
  			return currentUser ? _.contains(otherRoles, currentUser.role) : false;
  		},
  		validateCurrentUserRoleIn: function (roles){
        roles = roles.split(',');
        return _.contains(roles, Auth.getCurrentUser().role);
  		}
  	};
  });
