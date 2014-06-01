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
                editableForm: '='
            },
            link: function (scope, element, attrs) {
                scope.listType = attrs.listType || 'list';
                scope.title = attrs.title || "Quick list";
                scope.selectedFilter = {text:''};
                scope.quickList = scope.quickList || [];

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
                                if(form){
                                    FormService.addOrUpdate({id:form._id,target:'tasks'},model, function(){
                                        toaster.pop('success', "Field "+ model.title +" was added with success");
                                        scope.quickList.push(model);
                                    },function(err){
                                        toaster.pop('error', "There was an error saving field on server, "+err.message);
                                    });
                                }else{
                                    scope.quickList.push(model);
                                }
                            }
                        })

                }
            }
        };
    }]);
