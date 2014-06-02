'use strict';

angular.module('theBossApp')
    .controller('OrdersCtrl', ['$scope', 'OrderService','User','FormService', 'toaster', '$upload', '$timeout', 'CalendarService', function ($scope, OrderService, User, FormService, toaster, $upload, $timeout, CalendarService) {
        var date = new Date();
        var requiredDate = new Date(new Date().setDate(date.getDate()+21));

        $scope.$parent.pageHeader = 'Orders';
        $scope.order = {date_required: requiredDate};
        $scope.order.uploaded_files = [];
        $scope.isAddressVisible = false;
        $scope.order.forms = [];
        $scope.order_files = [];
        $scope.available_projects = [];
        $scope.order_search_fields = [{query:'customer', label:'Customer', api:'/api/customer'},{query:'created_by', label:'Created By', api:'/api/users'},{query:'projects.fields', label:'Projects'}];
        $scope.order_task_fields = [{title:'Title', type:'text', require: true},{title:'Duration', type:'text', require: true},{title:'Status Options', type:'textarea', require: true}];
        $scope.order_accessories_fields = [{title:'From Manufacturer', type:'text', require: true}, {title:'Quantity', type:'text', require: true},{title:'Received', type:'checkbox', require: false},{title:'Date Received', type:'date', require: false}];
        $scope.order_service_fields = [{title:'Service Date', type:'date', require: true}, {title:'Details', type:'textarea', require: true},{title:'Done By', type:'text', require: false}];

        function QueryOrders(query) {
            OrderService.query(query, function (res) {
                //pushOrderToList(res);
                $scope.list = res;
            })
        }

        $scope.search = function(filter){
            $scope.list = [];
            var query = {query: filter.query};
            if(filter.itemId){
                query.text = filter.itemId;
            }else{
                query.textLike = filter.text;
            }
            QueryOrders(query);

        }

        function loadLatestOrders(){
            $scope.list = [];
            QueryOrders();
        }


        $scope.edit = function (order) {
            //load order
            $scope.selectedFiles = [];
            $scope.order = order;
        }

        $scope.saveOrder = function(form){
            $scope.submitted = true;
            if (form.$valid) {
                var isNewOrder = false;
                if(!$scope.order._id){
                    $scope.order = new OrderService($scope.order);
                    isNewOrder = true;
                }

                $scope.order.$save({orderId:$scope.order._id},function(orderSaved){
                    $scope.submitted = false;
                    loadLatestOrders();
                    if(orderSaved && !orderSaved.scheduled){
                        $scope.addEvent(orderSaved,function(cal){

                            new OrderService.setScheduled({
                                id:orderSaved._id,
                                scheduled:true
                            },function(){
                                $scope.order = {};
                                toaster.pop('success', "Your order was scheduled to be delivered on "+ cal.end);
                            });

                        });
                    }else{
                        $scope.order = {};
                    }
                    toaster.pop('success', !isNewOrder ? "Existing Order was updated":"New order was created with success");
                },function(err){
                    toaster.pop('error', "Error saving the order",err.message? err.message : err);
                });
            }
        }

        $scope.reset = function(){
            $scope.order = {};
            $scope.submitted = false;
        }

        $scope.addProject = function(form){
            $scope.order.forms = $scope.order.forms || []
            $scope.order.forms.push({
                form_name: form.name,
                fields: form.fields,
                tasks: form.tasks
            });
        }

        $scope.taskStatusChange = function(task,status){
            task.changed_by = $scope.currentUser._id;
            task.changed_on = new Date();
            if(task.status)
                task.status_options.splice(task.status_options.indexOf(task.status),1);
            task.status = status;
            $scope.order.$save(function(order){
                toaster.pop('success', "Task status was changed to "+status);
                $scope.order = order;
            });
        }

        loadLatestOrders();
        $scope.$watchCollection('order.forms',function(){
            var hours = 0;
            if($scope.order && $scope.order.forms){
                $scope.order.forms.forEach(function(form){
                    if(form.tasks){
                        form.tasks.forEach(function(task){
                            hours += +task.duration.replace(/h$/,"");
                        })
                    }
                })
            }
            $scope.order.total_working_hours = hours;
        });


        $scope.uploadRightAway = true;
        $scope.hasUploader = function(index) {
            return $scope.upload[index] != null;
        };

        $scope.hasUploadingInProgress = function(){
            angular.forEach($scope.progress, function(percent){
                return percent < 100;
            })
        };

        $scope.abort = function(index) {
            $scope.upload[index].abort();
            $scope.upload[index] = null;
        };

        $scope.onFileSelect = function($files) {

            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] != null) {
                        $scope.upload[i].abort();
                    }
                }
            }
            $scope.upload = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
            for ( var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[i]);
                    var loadFile = function(fileReader, index) {
                        fileReader.onload = function(e) {
                            $timeout(function() {
                                $scope.dataUrls[index] = e.target.result;
                            });
                        }
                    }(fileReader, i);
                }
                $scope.progress[i] = -1;
                if ($scope.uploadRightAway) {
                    $scope.start(i);
                }
            }
        };

        $scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.errorMsg = null;

            $scope.upload[index] = $upload.upload({
                url : '/api/orders/'+$scope.order._id+'/upload',
                method: 'POST',
                //headers: {'my-header': 'my-header-value'},
                data : {
                    order_id : $scope.order._id
                },
                /* formDataAppender: function(fd, key, val) {
                 if (angular.isArray(val)) {
                 angular.forEach(val, function(v) {
                 fd.append(key, v);
                 });
                 } else {
                 fd.append(key, val);
                 }
                 }, */
                /* transformRequest: [function(val, h) {
                 console.log(val, h('my-header')); return val + 'aaaaa';
                 }], */
                file: $scope.selectedFiles[index]

            }).then(function(response) {
                    $scope.order.uploaded_files.push(response.data);
                    $scope.progress[index] = 100;
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;

                }, function(evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                }).xhr(function(xhr){
                    xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
                });

        };

        $scope.resetInputFile = function() {
            var elems = document.getElementsByTagName('input');
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].type == 'file') {
                    elems[i].value = null;
                }
            }
        };

        $scope.addEvent = function(order, updateOrderAsScheduled) {
            var cal = calendarDetailFromOrder(order);
            //save to server
            var calendarService = new CalendarService(cal);
            calendarService.$save(function(_cal){
                if(_cal._id){
                    updateOrderAsScheduled(_cal);
                }
            });
        };

        /* add custom event*/
        function calendarDetailFromOrder(order) {
            var requiredDate = new Date(order.date_required);
            var start = new Date(requiredDate.setHours(requiredDate.getHours() - order.total_working_hours));
            return {
                owner: $scope.currentUser.owner,
                title: order.customer.name,
                details: order.customer.name,
                //url: '/order/',
                start: start,
                end: requiredDate,
                color: ''
                //allDay: true
            };
        };
    }]);
