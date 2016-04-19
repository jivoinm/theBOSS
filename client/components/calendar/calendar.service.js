'use strict';

angular.module('theBossApp')
  .service('calendar', function (OrderService) {
    return {
      numberOfScheduledOrders: function(date, callout){
        OrderService.query({date_required: date}).$promise.
            then(function (orders){
              callout(orders.totalOrders);
            });
          }
    };
  });
