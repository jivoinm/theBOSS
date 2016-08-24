'use strict';

angular.module('theBossApp')
  .service('roles', function($rootScope, Auth) {
  	
    var roles = {
      adminRoles: ['admin'],
      salesRepRoles: ['sales rep'],
      serviceRepRoles: ['service rep'],
      otherRoles: ['worker']
    }
  	return {
  		validateRoleAdmin: function (currentUser) {
  			currentUser = (currentUser || $rootScope.currentUser);
  			return currentUser ? 
        _.contains(roles.adminRoles, currentUser.role) || 
        _.contains(roles.salesRepRoles, currentUser.role)  : 
        false;
  		},
      validateServiceApproval: function (currentUser) {
  			currentUser = (currentUser || $rootScope.currentUser);
  			return currentUser ? _.contains(roles.adminRoles, currentUser.role) || _.contains(roles.salesRepRoles, currentUser.role) : false;
  		},
  		validateRoleOther: function (currentUser) {
  			currentUser = (currentUser || $rootScope.currentUser);
  			return currentUser ? _.contains(roles.otherRoles, currentUser.role) : false;
  		},
  		validateCurrentUserRoleIn: function (matchRoles){
        matchRoles = matchRoles.split(',');
        var belongsTo = Object.keys(roles).filter(function(key, index){
          return matchRoles.indexOf(key) >-1 && roles[key].some(function(element){
            return element === Auth.getCurrentUser().role;
          })});
        return belongsTo && belongsTo.length > 0;
  		},
      allRoles: function(){
        return roles.adminRoles.concat(roles.salesRepRoles).concat(roles.serviceRepRoles).concat(roles.otherRoles);
      }
  	};
  });
