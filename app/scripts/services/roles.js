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
			return _.contains(adminRoles, currentUser.role);
		},
		validateRoleOther: function (currentUser) {
			currentUser = (currentUser || $rootScope.currentUser);
			return _.contains(otherRoles, currentUser.role);
		},

		validateCurrentUserRoleIn: function (roles){
			return _.contains(roles, $rootScope.currentUser.role);
		}
	};

  }]);
