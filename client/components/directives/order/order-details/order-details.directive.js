'use strict';

angular.module('theBossApp')
  .directive('orderDetails', function ($rootScope, $parse, FormService) {
    return {
      templateUrl: 'components/directives/order/order-details/order-details.html',
      restrict: 'E',
      scope: {
          order: '='
      },
      link: function (scope) {
        if(!scope.order._id){
          //new order load default forms
          FormService.get({
            module: 'Order',
            required: true
          }).$promise.then(function(res) {
            scope.order.forms = res;
          });
        }
        scope.$watch('order.forms', function(newValue, oldValue) {
          if(newValue && oldValue && newValue !== oldValue){
            angular.forEach(newValue, function(form){
              angular.forEach(form.fields, function(formField){
                if(formField.show_when){
                  var formula = formField.show_when;
                  var conditions =  formula.split(/ \&\& | \|\| /);
                  angular.forEach(conditions, function(condition){
                    //console.log(condition);
                    var fields = condition.split(/ \=\= | \!\=| /);
                    //console.log(fields);
                    angular.forEach(fields, function(field){
                        //console.log(field);
                        try{
                          var getProperty = $parse(field);
                          var value = getProperty(form).replace(/^\s+|\s+$/g,'');
                          value = '"'+ value +'"';
                        }catch(ex){
                          value = field;
                        }

                        formula = formula.split(field).join(value);
                    });
                  });
                  var evaluate = scope.$eval(formula);
                  if (evaluate) {
                    formField.hide = false;
                  }else{
                    formField.hide = true;
                  }
                }
              })
            })
          }
        }, true);
      }
    };
  });
