'use strict';

angular.module('theBossApp')

  .controller('CalendarCtrl',['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
        $scope.$parent.pageHeader = 'Calendar';
        $scope.orderStatus = $routeParams.status;
        $scope.queryText = '';
        $scope.loadOrders = function(){
        	$location.search('text',$scope.queryText);
        }
		
  }]);
