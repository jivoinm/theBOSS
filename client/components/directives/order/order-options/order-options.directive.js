'use strict';

angular.module('theBossApp')
  .directive('orderOptions', function () {
    return {
        template: '<div class="dropdown hidden">' +
            '          <button class="btn btn-default btn-xs dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">' +
            '           <span class="glyphicon glyphicon-cog"></span>' +
            '            <span class="caret"></span>' +
            '        </button>' +
            '            <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu1">' +
            '            </ul>' +
            '            </div> ',
        restrict: 'E',
        replace: true,
        scope: {
            order: '='
        },
        link: function postLink(scope, element, attrs) {
            element.parent().parent().bind('mouseenter', function() {
                element.removeClass('hidden')
            });
            element.parent().parent().bind('mouseleave', function() {
                element.addClass('hidden')
            });

            if(scope.order){
                //check permissions/role
                if(scope.order.status.toLowerCase() === 'new')
                {
                    element.find('ul').append('<li role="presentation"><a role="menuitem" tabindex="-1" href="" ng-click="approveOrder({{ scope.order._id }})">Approve</a></li>');
                }
            }
        }
    };
  });
