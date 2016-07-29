'use strict';

angular.module('theBossApp')
  .directive('alerts', function (Auth, roles, timeOff, $interval, ModalService, $cookieStore, OrderService, $uibModalStack) {
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
          var getIgnoreCookieKey = function(){
            return 'ignore-services-'+Auth.getCurrentUser().email;
          };
          //check if thre are services to alert
          if(roles.validateCurrentUserRoleIn('sales rep,admin')) {
            OrderService.newAndNotCompletedServicesOlderThanTwoWeeks().$promise.then (function (data) {
                scope.alerts.push(createNewAlert('Services','fa-tasks', 'There are '+ data.length +' orders that have services to be reviewed','/order/services'));
                var ignoredAlerts = $cookieStore.get(getIgnoreCookieKey());
                if(!ignoredAlerts && data.length > 0 && !$uibModalStack.getTop()){
                  ModalService.show.showPopup('Outstanding Services',
                  '<strong>You currently have '+data.length+' of order(s) with services that have been outstanding for more than 2 weeks. Please have these services completed in order to avoid this pop-up.</strong>', function(){
                      $cookieStore.put(getIgnoreCookieKey(), data.length);

                  })();
                }
                if(ignoredAlerts && ignoredAlerts !== data.length){
                  $cookieStore.remove(getIgnoreCookieKey());
                }
            });
          }
        };
        
        if(Auth.isLoggedIn()){
          scope.checkForUpdates();
          $interval(scope.checkForUpdates, 100000);
        }
      }
    };
  });
