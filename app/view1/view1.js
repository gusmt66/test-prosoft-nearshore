'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http', function($scope, $http) {

    // Initializing input data
  $scope.data = {
      startDate: new Date(),
      days: null,
      countryCode: null
  };

    // Looking for holidays
    var holidays = null;
    var url = "https://holidayapi.com/v1/holidays?key=474a7f5a-9640-46eb-a520-83731dd99c8a&country=" + $scope.data.countryCode + "&year=2018";

    $http.get(url).then(function(response){
        holidays = response.data.holidays;
        console.log(holidays);
    },function(error){
        console.log('error retrieving holidays');
    });

    //number of calendars to be displayed
    $scope.calendars = [];


    $scope.createCalendar = function () {

      var datesMonth = [];

      for(var i=0; i<=$scope.data.days; i++){

        var currentDate = new Date($scope.data.startDate);

        currentDate.setDate(currentDate.getDate() + i);

        var calendarDay = {
            day: null,
            date: null,
            month: null,
            year: null,
            isWeekDay: null,
            isHolidays: null
        };

        calendarDay.date = currentDate.getDate(); //number of the mont: 1 to 31
        calendarDay.month = currentDate.getMonth() + 1; //month
        calendarDay.year = currentDate.getFullYear(); // year
        calendarDay.day = currentDate.getDay(); //day of the week: 0 to 6

        //checking if it is holidays
        var formattedMonth = currentDate.getMonth()+1;

        if (formattedMonth < 10){
            formattedMonth = "0" + formattedMonth;
        }

        var formattedDate = currentDate.getDate();
        if (formattedDate < 10){
            formattedDate = "0" + formattedDate;
        }

        if(holidays[currentDate.getFullYear() + "-" + formattedMonth + "-" + formattedDate]){
          calendarDay.isHolidays = true;
        }

        //checking if it is a weekday or weekend -> 0 is Sunday, 6 is Saturday
        if(currentDate.getDay() > 0 && currentDate.getDay() < 6){
            calendarDay.isWeekDay = true;
        }else{
            calendarDay.isWeekDay = false;
        }

        if(datesMonth.length > 0){

            if(calendarDay.month !== datesMonth[0].month || i===$scope.data.days){
                $scope.calendars.push(datesMonth);
                datesMonth = [];
            }
        }

        //Adds the date to the array of the current month
        datesMonth.push(calendarDay);

      }

      console.log($scope.calendars);
  };

}]);