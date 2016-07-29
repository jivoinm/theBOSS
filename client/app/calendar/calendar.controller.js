'use strict';

angular.module('theBossApp')
  .controller('CalendarCtrl', function ($scope, OrderService, toaster, ModalService,
    moment, theBossSettings, roles, $location, $stateParams, Auth, $compile, $timeout, timeOff,uiCalendarConfig, calendar) {
      $scope.$parent.pageHeader = 'Calendar';
      $scope.queryText = '';
      $scope.uiCalendarConfig = uiCalendarConfig;
      var orderModal = {};

      $scope.loadOrders = function(){
        $scope.uiCalendarConfig.calendars.myCalendar.fullCalendar('refetchEvents');
      };

      $scope.getLabelColor = function (status){
          if (!status) {return 'label label-warning';}

          if(status.toLowerCase() === 'approved'){
             return '#777';
          }else if(status.toLowerCase() === 'finished'){
              return '#5cb85c';
          }else if(status.toLowerCase() === 'in progress'){
              return '#337ab7';
          }else if(status.toLowerCase() === 'installation'){
              return '#000000';
          }else if(status.toLowerCase() === 'shipped'){
              return '#B4AA5B';
          }else if(status.toLowerCase() === 'blocked' || status.toLowerCase() === 'service'){
              return '#d9534f';
          }else {
              return '#f0ad4e';
          }
      };

      $scope.LoadOrders = function (start, end,something, callback) {
          var query = {};
          if($scope.queryText){
              query.text = $scope.queryText;
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
                              this.push(
                                $scope.createEvent('date_required', order, order._id,
                                ((order.installation_date && order.installation_date !== order.date_required ? '(Chg)' : '')+ '['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doorsSelection || '')),
                                  order.date_required,
                                  (order.installation_date && order.installation_date !== order.date_required ? $scope.getLabelColor('installation') : $scope.getLabelColor(order.status)), 'Forms'));
                          }

                          if(!order.shipped_date && order.installation_date && order.installation_date !== order.date_required){
                              this.push($scope.createEvent('installation_date', order, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doorsSelection || '') ),
                                      order.installation_date,
                                      $scope.getLabelColor(order.status), 'Forms'));
                          }
                          if(order.shipped_date){
                              this.push($scope.createEvent('shipped_date', order, order._id, ('['+ order.po_number + '] '+ order.customer.name+ ' '+(order.doorsSelection || '') ),
                                      order.shipped_date, $scope.getLabelColor('shipped'), 'Forms'));
                          }

                      }catch(ex){
                          console.log('error loading this order',order,ex);
                      }
                  }, allEvents);

                  callback(allEvents);

              }, function (err){
                  toaster.pop('error', 'Error', 'Error loading orders '+ err);
                  console.log(err);
              });
      };

      $scope.LoadOtherGroupOrders = function (start, end,something, callback) {
          var query = {};
          if($scope.queryText){
              query.text = $scope.queryText;
          }
          var allEvents = [];
          if($stateParams.section === 'service' || !Auth.getCurrentUser().groups || Auth.getCurrentUser().groups.length===0) {
            callback(allEvents);
            return;
          }
          query.status = $stateParams.status;
          query.from = moment(start).zone(theBossSettings.timeZone).format('YYYY-MM-DD');
          query.to = moment(end).zone(theBossSettings.timeZone).format('YYYY-MM-DD');

          OrderService.getOtherGroupOrders(query).$promise.
              then(function (orders) {
                  //set summary of roders
                  angular.forEach(orders, function (order){
                    var eventDate = new Date(order._id.year, order._id.month -1 , order._id.day);
                    this.push($scope.createEventReserved(order.totalProjects+' Job(s)', eventDate, eventDate));  
                    
                  }, allEvents);

                  callback(allEvents);

              }, function (err){
                  toaster.pop('error', 'Error', 'Error loading orders '+ err);
                  console.log(err);
              });
      };

      $scope.LoadOtherGroupServices = function (start, end,something, callback) {
          var query = {};
          if($scope.queryText){
              query.text = $scope.queryText;
          }
          var allEvents = [];
          if($stateParams.section === 'service' || !Auth.getCurrentUser().groups || Auth.getCurrentUser().groups.length===0) {
            callback(allEvents);
            return;
          }
          query.status = $stateParams.status;
          query.from = moment(start).zone(theBossSettings.timeZone).format('YYYY-MM-DD');
          query.to = moment(end).zone(theBossSettings.timeZone).format('YYYY-MM-DD');

          OrderService.getOtherGroupServices(query).$promise.
              then(function (orders) {
                  //set summary of roders
                  angular.forEach(orders, function (order){
                    var eventDate = new Date(order._id.year, order._id.month -1 , order._id.day);
                    this.push($scope.createEventReserved(order.totalServices+' Service(s)', eventDate, eventDate));  
                    
                  }, allEvents);

                  callback(allEvents);

              }, function (err){
                  toaster.pop('error', 'Error', 'Error loading orders '+ err);
                  console.log(err);
              });
      };

      $scope.LoadServices = function (start, end,something, callback) {
          var query = {};
          if($scope.queryText){
              query.text = $scope.queryText;
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
                          service.date, $scope.getLabelColor(service.completed ? 'shipped' : 'service'), 'Services'));

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

        if($scope.queryText){
            query.text = $scope.queryText;
        }
        var allEvents = [];
        timeOff.getTimeOff(query).$promise.then(function (timeoffs){
          angular.forEach(timeoffs, function (timeoff){
            var timeoffDetail = timeoff.type === 'Statutory holiday' ? timeoff.detail : (timeoff.createdBy.name + ' - '+ timeoff.type);
            allEvents.push($scope.createEventOff(timeoffDetail, timeoff.from, timeoff.to));

          });
          callback(allEvents);
        });
      };

      $scope.createEventOff = function(title, start, end){
          var calendarOrder = {
            title: title,
            start: start,
            end: end,
            color: '#CABDBF',
            allDay: true,
            editable:false,
          };
          return calendarOrder;
      };

      $scope.createEventReserved = function(title, start, end){
          var calendarOrder = {
            title: title,
            start: start,
            end: end,
            color: '#FF80AB',
            allDay: true,
            editable:false,
          };
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
          calendarOrder.editable = true;
          return calendarOrder;
      };

      var isAdminRole = roles.validateRoleAdmin(Auth.getCurrentUser());

      $scope.eventDrop = function (event, delta, revertFunc) {
        calendar.numberOfScheduledOrders(moment(event.start).zone(theBossSettings.timeZone).format(), function(countOrdersOnThisDay){
          if(countOrdersOnThisDay >= 2 && event.className !== 'Services'){
            if(!confirm('This date already has '+countOrdersOnThisDay+' jobs on it. Would you like to continue anyways?'))
            {
              revertFunc();
              return;
            }
          }
          if(isAdminRole)
          {
              updateCalendarEvent(event);
          } else
          {
            revertFunc();
          }  

        });
      };

      $scope.eventClick = function (event){
        if(event.editable){
          OrderService.get({orderId:event.order_id}).$promise.then(function(result){
              orderModal = ModalService.show.showOrderDetailsPopup('Event details',result, event.className)();
          }, function(err){
                  ModalService.showPopup('Error loading event details',err);
              });
         }
      };

      $scope.$on('order.service.print', function(e, order, serviceIndex) {
          $location.path('/order/detail/'+order+'/print/' + serviceIndex);
          orderModal.close();
        });

      $scope.eventResize = function (event){
          updateCalendarEvent(event);
      };

      $scope.eventRender = function( event, element ) {
        $timeout(function(){
          $(element).attr('title', event.title);
        });
      };

      /* config object */
      $scope.uiConfig = {
          calendar: {
              header: {
                  left: 'today prev,next',
                  center: 'title',
                  right: 'month,basicWeek'
              },
              editable: isAdminRole,
              eventClick: $scope.eventClick,
              eventDrop: $scope.eventDrop,
              eventResize: $scope.eventResize,
              eventRender: $scope.eventRender
          }
      };

      $scope.yearView = function(){
          var currentView = $scope.myCalendar.fullCalendar('getView');
          ModalService.showPopup('Event details '+currentView.title, '');
      };

      //update calendar event on server and ui
      function updateCalendarEvent(event) {
          var calendar = {
              orderId:event.order_id,
              property: event.update_date,
              date: moment(event.start).zone(theBossSettings.timeZone).format()
          };
          OrderService.setdate_required(calendar);
      }

      $scope.eventSources = [$scope.LoadOrders, $scope.LoadServices, $scope.LoadTimeOffs, $scope.LoadOtherGroupOrders,
       $scope.LoadOtherGroupServices];
      if($stateParams.status)
      {
        $scope.orderStatus = $stateParams.status;
      }
  });
