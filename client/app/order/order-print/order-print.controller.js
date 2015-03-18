'use strict';

angular.module('theBossApp')
  .controller('OrderPrintCtrl', function ($scope, order, $stateParams, $window) {
    $scope.action = $stateParams.action;
    $scope.order = order;
    $scope.print = function(){
      $window.print();
    };
  });
