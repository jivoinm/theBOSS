'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService', '$routeParams', function ($scope, OrderService, $routeParams) {
        $scope.orders = [];
        $scope.orderStatus = 'new';

        if($routeParams.status){
            $scope.orderStatus = $routeParams.status;
        }

        $scope.loadOrders = function (status,queryText, callback){
            var query = {};
            if(status){
                query.status = status;
                $scope.orderStatus = status;
            }

            if(queryText){
                query.text = queryText;
            }

            OrderService.query(query).$promise.then (function (orders) {
                //$scope.orders = orders;
                callback(orders);
            });
        }

        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: true
        };
        $scope.totalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [250, 500, 1000],
            pageSize: 250,
            currentPage: 1
        };
        $scope.setPagingData = function(data, page, pageSize){
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            $scope.myData = pagedData;
            $scope.totalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        $scope.getPagedDataAsync = function (pageSize, page, searchText) {
            setTimeout(function () {
                var data;
                if (searchText) {
                    var ft = searchText.toLowerCase();
                    $scope.loadOrders($scope.orderStatus, ft, function (orders) {
                        data = orders.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data,page,pageSize);
                    })

                } else {
                    $scope.loadOrders($scope.orderStatus, ft, function (orders) {
                        $scope.setPagingData(orders,page,pageSize);
                    })
                }
            }, 100);
        };

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);
        //customer.name po_number created_by.name created_on date_required status
        $scope.gridOptions = {
            data: 'myData',
            enablePaging: true,
            showFooter: true,
            enableRowSelection:false,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            columnDefs: [
                {field:'po_number', displayName:'PO #', cellTemplate: '<a href="#/order/{{row.entity._id}}">{{row.entity[col.field]}}</a>'},
                {field:'customer.name', displayName:'Customer'},
                {field:'created_by.name', displayName:'Created By'},
                {field:'created_on', displayName:'Created On', cellTemplate: '<div>{{row.entity[col.field] | date}}</div>'},
                {field:'status', displayName:'Status'},
                {field:'_id', displayName:'', width: '20', cellTemplate: '<div tb-order-options orderId="{{row.entity[col.field]}}"></div>'}
                ]
        };

    }]);
