'use strict';

angular.module('theBossApp')
  .controller('CalendarCtrl', function ($scope, OrderService, toaster, ModalService, moment, theBossSettings, roles, $location, $stateParams, Auth, $compile, $timeout, timeOff) {
      $scope.$parent.pageHeader = 'Calendar';
      $scope.queryText = '';

      $scope.loadOrders = function(){
      	$location.search('text',$scope.queryText);
      };

      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      $scope.getLabelColor = function (status){
          if (!status) {return 'label label-warning';}

          if(status.toLowerCase() === 'approved'){
             return '#777';
          }else if(status.toLowerCase() === 'finished'){
              return '#B4AA5B';
          }else if(status.toLowerCase() === 'in progress'){
              return '#337ab7';
          }else if(status.toLowerCase() === 'installation'){
              return '#000000';
          }else if(status.toLowerCase() === 'shipped'){
              return '#5cb85c';
          }else if(status.toLowerCase() === 'blocked' ||status.toLowerCase() === 'service'){
              return '#d9534f';
          }else {
              return '#f0ad4e';
          }
      };

      $scope.LoadOrders = function (start, end,something, callback) {
          var query = {};
          if($location.search()){
              query = $location.search();
          }
          var allEvents = [];
          if($stateParams.section === 'service') {
            callback(allEvents);
            return;
          }
          query.status = $stateParams.status;
          query.from = moment(start).zone(theBossSettings.timeZone).format('YYYY-MM-DD');
          query.to = moment(end).zone(theBossSettings.timeZone).format('YYYY-MM-DD');

          OrderService.getOrders(query).$promise.
              then(function (orders){
                  //set order to calendar
                  angular.forEach(orders, function (order){
                      try{
                          if(!order.shipped_date) {
                              this.push($scope.createEvent('date_required', order, order._id, ( (order.installation_date ? "(Chg)" : "")+ '['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '')),
                                  order.date_required,$scope.getLabelColor(order.status), 'Order'));
                          }

                          if(order.installation_date && order.installation_date !== order.date_required){
                              this.push($scope.createEvent('installation_date', order, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '') ),
                                      order.installation_date, $scope.getLabelColor('installation'), 'Order'));
                          }
                          if(order.shipped_date){
                              this.push($scope.createEvent('shipped_date', order, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doors || '') ),
                                      order.shipped_date, $scope.getLabelColor('shipped'), 'Order'));
                          }

                      }catch(ex){
                          console.log('error loading this order',order,ex);
                      }
                  }, allEvents);

                  callback(allEvents);

              }, function (err){
                  toaster.pop('error', "Error", 'Error loading orders '+ err);
                  console.log(err);
              });
      };

      $scope.LoadServices = function (start, end,something, callback) {
          var query = {};
          if($location.search()){
              query = $location.search();
          }
          var allEvents = [];
          if($stateParams.section === 'jobs') {
            callback(allEvents);
            return;
          }
          query.approved = $stateParams.approved;
          query.completed = $stateParams.completed;
          query.from = moment(start).zone(theBossSettings.timeZone).format('YYYY-MM-DD');
          query.to = moment(end).zone(theBossSettings.timeZone).format('YYYY-MM-DD');

          OrderService.getOrderServices(query).$promise
          .then(function (orders){
            angular.forEach(orders, function (order){
              if(order.services && order.services.length > 0){
                  angular.forEach(order.services, function(service,i){
                    var label = service.completed ? '[completed]' : (service.approved ? '[approved]' : '[new]');
                    allEvents.push($scope.createEvent('services.'+i+'.date', service, order._id, 'Service '+label+'-['+ order.po_number + '] '+ order.customer.name,
                          service.date,$scope.getLabelColor('service'), 'Service'));

                  });
              }
            }, allEvents);
            callback(allEvents);
          });

      };

      $scope.LoadTimeOffs = function (start, end,something, callback){
        var query = {
          dateFrom: start,
          dateTo: end,
          approved: true
        };
        var allEvents = [];
        timeOff.getTimeOff(query).$promise.then(function (timeoffs){
          angular.forEach(timeoffs, function (timeoff){
            var timeoffDetail = (timeoff.createdBy.name + ' - '+ timeoff.type) + (timeoff.type == 'Statutory holiday' ? ' - '+timeoff.detail : '');
            allEvents.push($scope.createEventOff(timeoffDetail, timeoff.from, timeoff.to));

          });
          callback(allEvents);
        });
      }

      $scope.createEventOff = function(title, start, end){
          var calendarOrder = {
            title: title,
            start: start,
            end: end,
            color: '#CABDBF',
            allDay: true,
            editable:false
          }
          return calendarOrder;
      };

      $scope.createEvent = function(updateDate, item, orderId, title, start, labelColor, className){
          var calendarOrder = {};
          calendarOrder.order_id = orderId;
          calendarOrder.title = title;
          calendarOrder.start = start;
          calendarOrder.end = start;
          calendarOrder.color = labelColor;
          calendarOrder.className = className;
          calendarOrder.update_date = updateDate;
          calendarOrder.item = item;
          calendarOrder.allDay = true;
          return calendarOrder;
      };

      $scope.eventDrop = function (event,dayDelta,minuteDelta,revertFunc) {
          updateCalendarEvent(event);
      };

      $scope.eventClick = function (event){
          var details = event.details;
          OrderService.get({orderId:event.order_id}).$promise.then(function(result){
              ModalService.show.showOrderDetailsPopup('Event details',result)();
          }, function(err){
                  ModalService.showPopup('Error loading event details',err);
              });

      };

      $scope.eventResize = function (event,dayDelta,minuteDelta,revertFunc){
          updateCalendarEvent(event);
      };


      /* config object */
      $scope.uiConfig = {
          calendar: {
              header: {
                  left: 'today prev,next',
                  center: 'title',
                  right: 'month,basicWeek'
              },
              editable: roles.validateRoleAdmin(Auth.getCurrentUser()),
              eventClick: $scope.eventClick,
              eventDrop: $scope.eventDrop,
              eventResize: $scope.eventResize,
              eventRender: $scope.eventRender
          }
      };

      $scope.yearView = function(){
          var currentView = $scope.myCalendar.fullCalendar('getView');
          ModalService.showPopup('Event details '+currentView.title, '');
      }

      //update calendar event on server and ui
      function updateCalendarEvent(event) {
          var calendar = {
              orderId:event.order_id,
              property: event.update_date,
              date: moment(event.start).zone(theBossSettings.timeZone).format()
          };
          OrderService.setdate_required(calendar);
      }

      $scope.eventSources = [$scope.LoadOrders, $scope.LoadServices, $scope.LoadTimeOffs];
      if($stateParams.status)
      {
        $scope.orderStatus = $stateParams.status;
      }
      // $scope.$on('$locationChangeSuccess', function(next, current) {
      //
      //   $scope.myCalendar.fullCalendar('refetchEvents');
      // });
  });
