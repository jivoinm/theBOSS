'use strict';

angular.module('theBossApp')
  .controller('OrderPrintCtrl', function ($scope, order, $stateParams, $window, $filter) {
    $scope.action = $stateParams.action;
    $scope.order = order;
    $scope.getFormDate =  function (){
      return $filter('date')(new Date());
    };

    $scope.print = function(){
      $window.print();
    };
  });
