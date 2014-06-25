'use strict';

angular.module('theBossApp')
  .controller('CustomerFormCtrl', ['$scope', 'CustomerFormService', '$routeParams', function ($scope, CustomerFormService, $routeParams) {
      console.log($routeParams);
      if($routeParams.id){
        CustomerFormService.get($routeParams.id).$promise.then(
            function(customerForm){
                $scope.customerForm = customerForm;    
            },
            function(err){
                console.log(err);
            }
        )
      }
    
  }]);
