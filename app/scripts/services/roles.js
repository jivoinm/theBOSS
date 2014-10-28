'use strict';

/**
 * @ngdoc service
 * @name theBossApp.roles
 * @description
 * # roles
 * Service in the theBossApp.
 */
angular.module('theBossApp')
  .service('roles', ['$rootScope', function($rootScope) {
  	'use strict';
	var adminRoles = ['admin'];
	var otherRoles = ['user'];
	var otherRoles = ['user'];
	return {
		validateRoleAdmin: function (currentUser) {
			currentUser = (currentUser || $rootScope.currentUser);
			return currentUser ? _.contains(adminRoles, currentUser.role) : false;
		},
		validateRoleOther: function (currentUser) {
			currentUser = (currentUser || $rootScope.currentUser);
			return currentUser ? _.contains(otherRoles, currentUser.role) : false;
		},

		validateCurrentUserRoleIn: function (roles){
			return $rootScope.currentUser ? _.contains(roles, $rootScope.currentUser.role) : false;
		}
	};

  }]);
