'use strict';

angular.module('theBossApp')
  .directive('orderPreview', function ($stateParams, $filter) {
    return {
      templateUrl: 'components/directives/order/order-preview/order-preview.html',
      restrict: 'E',
      scope:{
          order:'='
      },
      controller: function($scope){
          $scope.preview = true;
          $scope.tabs = [
            { title:"Forms", template:'components/directives/order/order-preview/tab-forms.html', active: true },
            { title:"Services", template:'components/directives/order/order-preview/tab-services.html', active: false },
            { title:"Accessories", template:'components/directives/order/order-preview/tab-accessories.html', active: false },
            { title:"Files", template:'components/directives/order/order-preview/tab-files.html', active: false },
            { title:"Notes", template:'components/directives/order/order-preview/tab-notes.html', active: false },
          ];

          if($stateParams.tab){
            angular.forEach($scope.tabs, function(item){
              if(item.title === $stateParams.tab){
                item.active = true;
              }else{
                item.active = false;
              }
            })
          }
      }
    };
  });
