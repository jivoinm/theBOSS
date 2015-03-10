'use strict';

angular.module('theBossApp')
  .controller('CalendarCtrl', function ($scope, $stateParams, $location) {
      $scope.$parent.pageHeader = 'Calendar';
      $scope.orderStatus = $stateParams.status;
      $scope.queryText = '';
      $scope.loadOrders = function(){
      	$location.search('text',$scope.queryText);
      };
  });
