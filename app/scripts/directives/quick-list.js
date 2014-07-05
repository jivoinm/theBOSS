'use strict';

angular.module('theBossApp')
    .directive('quickList',['$http', 'ModalService', 'FormService', 'toaster', function ($http, ModalService, FormService, toaster) {
        return {
            templateUrl: '/views/directive-templates/quick-list.html',
            restrict: 'E',
            transclude: true,
            scope: {
                quickList: '=',
                itemSelect: '&',
                searchFilter: '=',
                listSearch: '&',
                listFieldsToEdit: '=',
                editableForm: '=',
                footerForm: '='
            },
            link: function (scope, element, attrs) {
                scope.listType = attrs.listType || 'list';
                scope.title = attrs.title || "Quick list";
                scope.selectedFilter = {text:''};
                scope.quickList = scope.quickList || [];
                scope.preview = attrs.preview || scope.$parent.preview;
                scope.selectedItem = null;

                var pagesShown = 1;
                var pageSize = 5;
                scope.itemsLimit = function(){
                    return pageSize * pagesShown;
                }

                scope.hasMoreItemsToShow = function() {
                    return scope.quickList && pagesShown < (scope.quickList.length / pageSize);
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

                scope.selectedResult = function(item){
                    scope.selectedFilter.itemId = item._id;
                }

                scope.addNewField = function(form){
                    ModalService.modalFormDialog('Add new field',
                        scope.listFieldsToEdit, function(model){
                            if(model){
                                scope.quickList.push(model);
                                if(form && form.$save){
                                    form.$save(function(){
                                        toaster.pop('success', "Field was saved with success");
                                        scope.quickList.push(model);
                                    },function(err){
                                        toaster.pop('error', "There was an error saving field on server, "+err.message);
                                    });
                                }
                                model = null;
                            }
                        })

                }

                scope.selectItem = function(item){
                    scope.selectedItem = item;
                    scope.itemSelect(item);
                }

//                scope.$watch('selectedId', function(newValue, old){
//                    if(newValue != old){
//                        console.log(newValue);
//                        console.log(element);
//                        element.remove
//                    }
//
//                });
            }
        };
    }]);
