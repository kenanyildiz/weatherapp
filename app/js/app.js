var app = angular.module('weatherApp', ['angularjs-dropdown-multiselect']);

app.controller('weatherCtrl', ['$scope', 'cityAPIService', 'weatherAPIService', function($scope, $cityAPIService, $weatherAPIService) {

    $scope.dummyModel = {};
    $scope.citiesData = [];
    $scope.ddSettings = {
        idProp: 'label',
        displayProp: 'label',
        enableSearch: false,
        selectionLimit: 1,
        showCheckAll: false,
        showUncheckAll: false,
        closeOnSelect: false,
        scrollable: true
    };

    $cityAPIService.getCity().then(function(dataResponse){
        $scope.parseCityData(dataResponse.data);
    });

    $scope.parseCityData = function (citiesData){
        for(var i in citiesData.data){
            $scope.citiesData.push({id: citiesData.data[i].ID, label: citiesData.data[i].Name});
        }
    };

    $scope.ddEvents = {
        onItemSelect: function(item){
            $scope.findWeather(item.id);
        }
    };

    $scope.findWeather = function(city) {
        $scope.items = '';
        $scope.fetchWeather(city);
    };

    $scope.fetchWeather = function(city) {
        $weatherAPIService.getWeather(city).then(function(dataResponse){
            $scope.place = dataResponse.data.query.results.channel;
        });
    };

}]);

/*app.directive('role', function(){
   return {
       restrict: 'A',
       compile: function(scope,element){
           console.log(element);
       }
   }
});*/

app.factory('cityAPIService', ['$http', function ($http){
    var cityAPI = {};
        cityAPI.getCity = function() {
            var url   = 'js/jsData/CitiesData.json';
            return $http.get(url);
        };
    return cityAPI;
}]);

app.factory('weatherAPIService', ['$http', function ($http){
    var weatherAPI = {};
        weatherAPI.getWeather = function (city) {
            var query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+city+'")',
                url   = "http://query.yahooapis.com/v1/public/yql?q=" + query + "&format=json&callback=";
            return $http.get(url);
        };
    return weatherAPI;
}]);

/*app.service('myDataService', ['$http', function ($http) {
    this.getData = function ($url) {
        return $http.get($url);
    };
}]);*/

