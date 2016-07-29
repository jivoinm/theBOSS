'use strict';

angular.module('theBossApp')
  .directive('orderPreview', function ($stateParams, $filter) {
    return {
      templateUrl: 'components/directives/order/order-preview/order-preview.html',
      restrict: 'E',
      scope:{
          order: '=',
          modal: '=',
          activeTab: '='
      },
      controller: function($scope){
          $scope.preview = true;
          $scope.tabs = [
            { title:'Forms', icon:'folder-open', template:'components/directives/order/order-preview/tab-forms.html', active: true },
            { title:'Services', icon:'wrench', template:'components/directives/order/order-preview/tab-services.html', active: false },
            { title:'Accessories', icon:'copy', template:'components/directives/order/order-preview/tab-accessories.html', active: false },
            { title:'Files', icon:'file', template:'components/directives/order/order-preview/tab-files.html', active: false },
            { title:'Notes', icon:'edit', template:'components/directives/order/order-preview/tab-notes.html', active: false },
            { title:'Work Log', icon:'tasks', 
            template:'components/directives/order/order-preview/tab-worklog.html', 
            active: false
            },
          ];

          if($stateParams.tab || $scope.activeTab) {
            angular.forEach($scope.tabs, function(item){
              if(item.title === $stateParams.tab || item.title === $scope.activeTab){
                item.active = true;
              }else{
                item.active = false;
              }
            });
          }
       }
    };
  });
