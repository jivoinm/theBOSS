'use strict';

angular.module('theBossApp')
  .filter('thebossDate', function () {
    return function (date) {
      if(date) {
        date = new Date(date);
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()).toLocaleDateString();
      }else{
      	return '';
      }
      
    };
  });
