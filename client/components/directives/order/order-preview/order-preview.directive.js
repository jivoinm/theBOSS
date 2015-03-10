'use strict';

angular.module('theBossApp')
  .directive('orderPreview', function ($filter) {
    return {
      templateUrl: 'components/directives/order/order-preview/order-preview.html',
      restrict: 'E',
      scope:{
          order:'='
      },
      controller: function($scope){
          $scope.preview = true;

      }
    };
  });
