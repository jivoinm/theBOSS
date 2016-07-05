'use strict';

angular.module('theBossApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('order', {
        url: '/order',
        templateUrl: 'app/order/order.html',
        authenticate: true
      })
      .state('order.list', {
        url: '/list',
        templateUrl: 'app/order/order-list/order-list.html',
        controller: 'OrderListCtrl',
        authenticate: true
      })
      .state('order.status', {
        url: '/list/:status',
        templateUrl: 'app/order/order-list/order-list.html',
        controller: 'OrderListCtrl',
        authenticate: true
      })
      .state('order.services', {
        url: '/services',
        templateUrl: 'app/order/order-services/order-services.html',
        controller: 'OrderServicesCtrl',
        authenticate: true
      })
      .state('order.services-status', {
        url: '/services/:status',
        templateUrl: 'app/order/order-services/order-services.html',
        controller: 'OrderServicesCtrl',
        authenticate: true
      })
      .state('order.new', {
        url: '/detail',
        templateUrl: 'app/order/order-detail/order-detail.html',
        resolve: {
                // A string value resolves to a service
                OrderService: 'OrderService',
                order: function(OrderService, $stateParams){
                  if(!$stateParams.id) return new OrderService({});
                  return new OrderService();
                }
            },
        controller: 'OrderDetailCtrl',
        authenticate: true
      })
      .state('order.detail', {
        url: '/detail/:id/:tab',
        templateUrl: 'app/order/order-detail/order-detail.html',
        resolve: {

                // A string value resolves to a service
                OrderService: 'OrderService',

                // A function value resolves to the return
                // value of the function
                order: function(OrderService, $stateParams){
                  if(!$stateParams.id) return new OrderService({});
                  return OrderService.get({orderId: $stateParams.id}).$promise.then(function(order){
                          //load order
                          return order;
                      });
                }
            },
        controller: 'OrderDetailCtrl',
        authenticate: true
      })
      .state('order.print', {
        url: '/detail/:id/print/:action',
        templateUrl: 'app/order/order-print/order-print.html',
        resolve: {
                // A string value resolves to a service
                OrderService: 'OrderService',
                // A function value resolves to the return
                // value of the function
                order: function(OrderService, $stateParams){
                  if(!$stateParams.id) return new OrderService({});
                  return OrderService.get({orderId: $stateParams.id}).$promise.then(function(order){
                          //load order
                          return order;
                      });
                }
            },
        controller: 'OrderPrintCtrl',
        authenticate: true
      });
  });
