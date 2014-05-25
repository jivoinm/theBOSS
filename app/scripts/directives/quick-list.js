'use strict';

angular.module('theBossApp')
    .directive('quickList',['$http', function ($http) {
        return {
            templateUrl: '/views/directive-templates/quick-list.html',
            restrict: 'E',
            scope: {
                quickList: '=',
                itemSelect: '&',
                searchFilter: '=',
                listSearch: '&'
            },
            link: function (scope, element, attrs) {
                scope.listType = attrs.listType || 'list';
                scope.title = attrs.title || "Quick list";
                scope.selectedFilter = {text:''};
                var pagesShown = 1;
                var pageSize = 5;
                scope.itemsLimit = function(){
                    return pageSize * pagesShown;
                }

                scope.hasMoreItemsToShow = function() {
                    return pagesShown < (scope.quickList.length / pageSize);
                };
                scope.showMoreItems = function() {
                    pagesShown = pagesShown + 1;
                };

                scope.lookup = function(text,api){
                    scope.selectedFilter.itemId = null;
                    if(api){
                        return $http.get(api, {
                            params: {
                                name: text
                            }
                        }).then(function(res){
                                var results = [];
                                angular.forEach(res.data, function(item){
                                    results.push(item);
                                });
                                return results;
                            });
                    }else{
                        return text;
                    }
                }

                scope.selectedResult = function(item, model, label){
                    scope.selectedFilter.itemId = item._id;
                }
            }
        };
    }]);
