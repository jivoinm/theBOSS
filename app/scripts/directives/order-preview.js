'use strict';

angular.module('theBossApp')
    .directive('orderPreview', function () {
        function CreateField(label, value) {
            value = value || '';
            return '<div class="form-group"> ' +
                '<label class="col-md-4 control-label">' + label + '</label>' +
                '<div class="form-control-static col-md-8">' + value + '</div>' +
                '</div>';
        }

        function CreatePanel(title, body){
            return '<div class="panel panel-default"><div class="panel-heading">'+title+'</div><div class="panel-body">' + body() + '</div></div>';
        }


        return {
            template: '<div class="row"> ' +
                '<div class="col-md-8" id="details"> </div>' +
                '<div class="col-md-4" id="other"> </div>' +
                '</div>',
            restrict: 'E',
            scope:{
                order:'='
            },

            link: function postLink(scope, element, attrs) {
                if(scope.order){
                    var details = element.find('#details');
                    var other = element.find('#other');
                    details.append(CreateField('Customer', scope.order.customer.name));
                    details.append(CreateField('Email', scope.order.customer.email));
                    scope.order.forms.forEach(function (form) {
                        details.append(CreatePanel(form.form_name, function(){
                            var body = '';
                            form.fields.forEach(function (field) {
                                body += CreateField(field.title, field.value);
                            })
                            return body;
                        }));

                        if(form.tasks){
                            other.append(CreatePanel('Tasks', function(){
                                var body = '';
                                form.tasks.forEach(function (task){
                                    if(task.status)
                                    {
                                        body += CreateField(task.title, task.status);
                                    }
                                    if(task.changed_by)
                                    {
                                        body += CreateField('By', task.changed_by + ' @ '+ task.changed_on);
                                    }
                                })
                                return body;
                            }));
                        }

                        if(form.ordered_accessories){
                            other.append(CreatePanel('Ordered Accessories', function(){
                                var body = '';
                                form.ordered_accessories.forEach(function (item){
                                    body += CreateField(item.title, item.status);
                                    
                                    if(item.date_received)
                                    {
                                        body += CreateField('Received by', item.received_by + ' @ '+ item.date_received);
                                    }
                                })
                                return body;
                            }));
                        }

                        if(form.services){
                            other.append(CreatePanel('Services', function(){
                                var body = '';
                                form.services.forEach(function (service){
                                    body += CreateField(service.details, service.date);
                                    
                                })
                                return body;
                            }));
                        }

                    });

                }else {
                    element.text('Missing order on the scope');
                }
            }
        };
    });
