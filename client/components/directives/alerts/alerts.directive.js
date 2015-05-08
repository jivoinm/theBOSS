'use strict';

angular.module('theBossApp')
  .directive('alerts', function (Auth, roles, timeOff, $interval) {
    function createNewAlert(type, icon, message, url){
      return {
        type: type,
        icon: icon,
        message: message,
        url: url
      };
    }
    return {
      templateUrl: 'components/directives/alerts/alerts.html',
      restrict: 'EA',
      replace: true,
      link: function (scope, element, attrs) {
        scope.checkForUpdates = function () {
          scope.alerts = [];
          if(roles.validateRoleAdmin(Auth.getCurrentUser())) {
            //find new unapproved time off
            timeOff.new().$promise.
                then(function (res){
                  if(res.total > 0) {
                    scope.alerts.push(createNewAlert('Time Off','icon-time', 'There are '+res.total+' to approve','/settings'));
                  }
                });
          }
        };
        scope.checkForUpdates();
        $interval(scope.checkForUpdates, 5000);
      }
    };
  });
