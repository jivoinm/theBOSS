'use strict';

angular.module('theBossApp')
  .service('CustomerFormService', ['$resource', function($resource) {
      return $resource('/api/customerforms/:id', {id:'@_id'},{       
      });
    
  }]);
