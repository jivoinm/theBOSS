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

        function CreateAccordion (titile, content){
            return '<accordion-group heading="'+title+'">'+
                    content +
                    '</accordion-group>'
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
                    if(scope.order.customer.bill_to)  details.append(CreateField('Bill To', scope.order.customer.bill_to));
                    if(scope.order.customer.ship_to)  details.append(CreateField('Ship To', scope.order.customer.ship_to));
                    if(scope.order.customer.email)  details.append(CreateField('Email', scope.order.customer.email));
                    if(scope.order.customer.phone)  details.append(CreateField('Phone', scope.order.customer.phone));
                    if(scope.order.customer.cell)  details.append(CreateField('Cell', scope.order.customer.cell));
                    details.append(CreateField('Doors', scope.order.doors));
                    scope.order.forms.forEach(function (form) {
                        details.append(CreatePanel(form.formName, function(){
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
                    });

                    if(scope.order.ordered_accessories){
                        other.append(CreatePanel('Ordered Accessories', function(){
                            var body = '<accordion close-others="oneAtATime">';
                            scope.order.ordered_accessories.forEach(function (item){
                                body += CreateAccordion('From: '+item.from_manufacturer+' - '+item.description, );
                                body += CreateField('From',item.from_manufacturer);
                                body += CreateField('Description',item.description);
                                body += CreateField('Quantity',item.quantity);
                                body += CreateField('Received',item.received);
                                
                            })
                            body += '</accordion>'
                            return body;
                        }));
                    }

                    if(scope.order.services){
                        other.append(CreatePanel('Services', function(){
                            var body = '';
                            scope.order.services.forEach(function (service){
                                body += CreateField('Date', service.date);
                                body += CreateField('Details', service.details);
                                
                            })
                            return body;
                        }));
                    }
                    if(scope.order.uploaded_files){
                        other.append(CreatePanel('Files', function(){
                            var body = '<div class="list-group">';
                            scope.order.uploaded_files.forEach(function (f){
                                body += '<a href="/uploads/'+ f.filename +'" target="_blank" class="list-group-item">'+f.filename+'<span class="badge">'+f.size+' kb</span></a>';
                            });
                            body += '</div>';
                            return body;
                        }));   
                    }
                }else {
                    element.text('Missing order on the scope');
                }
            }
        };
    });
