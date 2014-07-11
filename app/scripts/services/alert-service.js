'use strict';

angular.module('theBossApp')
    .service('AlertService', function () {
        var alerts = [];
        return {
            addSuccess:  function(message){
                alerts.push({type: 'success', msg: message});
            },

            addError: function(message){
                alerts.push({type: 'danger', msg: message});
            },

            getAlerts: function(){
                return alerts;
            }
        }
    });
