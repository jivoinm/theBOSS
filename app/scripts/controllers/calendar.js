'use strict';

angular.module('theBossApp')

  .controller('CalendarCtrl',['$scope', '$routeParams', function ($scope, $routeParams) {
        $scope.$parent.pageHeader = 'Calendar';
        $scope.orderStatus = $routeParams.status || 'New';
		
  }]);
