'use strict';

angular.module('theBossApp')
  .directive('fileUploads', function ($upload, $timeout, $rootScope, theBossSettings, toaster, OrderService) {
      return {
          templateUrl: 'components/directives/file-uploads/file-uploads.html',
          restrict: 'E',
          scope:{
              model: '='
          },

          link: function postLink(scope, element, attrs) {
              scope.preview = attrs.preview || scope.$parent.preview;

              $rootScope.$on(theBossSettings.previewModeEvent, function (event, preview){
                  scope.preview = preview;
              });
              
              // scope.downloadFile=function(filename){
              //   Order.download({filename:filename}).$promise.then();
              //   $http({method:'GET', url:'/api/orders/download/'+filename}).
              //     success(function(data, status, headers, config) {         
              //       var element = angular.element('<a/>');
              //        element.attr({
              //            href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
              //            target: '_blank',
              //            download:'test.csv'
              //        })[0].click();
              //      }).
              //     error(function(data, status, headers, config) {
              //      });
              // }

              scope.encodeFileName = function(fileName) {
                return encodeURIComponent(fileName);
              }

              scope.deleteFile = function (file, index, event){
                scope.model.uploaded_files.splice(index,1);
                scope.model.$save(function(){
                    toaster.pop('success', "Success", 'Delete file '+ file.filename);
                })
              }

              if(attrs.uploadUrl){
                scope.model = scope.model || {};
                scope.uploadRightAway = true;
                scope.hasUploader = function(index) {
                    return scope.upload[index] != null;
                };

                scope.hasUploadingInProgress = function(){
                    angular.forEach(scope.progress, function(percent){
                        return percent < 100;
                    });
                };

                scope.abort = function(index) {
                    scope.upload[index].abort();
                    scope.upload[index] = null;
                };

                scope.onFileSelect = function($files) {
                    scope.progress = [];
                    if (scope.upload && scope.upload.length > 0) {
                        for (var i = 0; i < scope.upload.length; i++) {
                            if (scope.upload[i] != null) {
                                scope.upload[i].abort();
                            }
                        }
                    }
                    scope.upload = [];
                    scope.selectedFiles = $files;
                    scope.dataUrls = [];
                    for ( var i = 0; i < $files.length; i++) {
                        var $file = $files[i];
                        if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var loadFile = function(fileReader, index) {
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        scope.dataUrls[index] = e.target.result;
                                    });
                                }
                            }(fileReader, i);
                        }
                        scope.progress[i] = -1;
                        if (scope.uploadRightAway) {
                            scope.start(i);
                        }
                    }
                };

                scope.start = function(index) {
                    scope.progress[index] = 0;
                    scope.errorMsg = null;

                    scope.upload[index] = $upload.upload({
                        url : attrs.uploadUrl,
                        method: 'POST',
                        file: scope.selectedFiles[index]

                    }).then(function(response) {
                            scope.model.uploaded_files.push(response.data);
                            scope.model.$save(function(){
                              scope.progress[index] = 100;
                              toaster.pop('success', "Success", 'Uploaded file with success '+ response.data.filename);
                            });

                        }, function(response) {
                            if (response.status > 0) scope.errorMsg = response.status + ': ' + response.data;

                        }, function(evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        }).xhr(function(xhr){
                            xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                        });

                };

                scope.resetInputFile = function() {
                    var elems = document.getElementsByTagName('input');
                    for (var i = 0; i < elems.length; i++) {
                        if (elems[i].type == 'file') {
                            elems[i].value = null;
                        }
                    }
                };
            }
            else{
                element.text('You need to set upload-url attribute');
              }
          }
    };
  });
