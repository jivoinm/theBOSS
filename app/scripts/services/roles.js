'use strict';

/**
 * @ngdoc service
 * @name theBossApp.roles
 * @description
 * # roles
 * Service in the theBossApp.
 */
angular.module('theBossApp')
  .service('roles', function roles() {
  	'use strict';
	var adminRoles = ['admin'];
	var otherRoles = ['user'];
	return {
		validateRoleAdmin: function (currentUser) {
			return currentUser ? _.contains(adminRoles, currentUser.role) : false;
		},
		validateRoleOther: function (currentUser) {
			return currentUser ? _.contains(otherRoles, currentUser.role) : false;
		}
	};

  });
