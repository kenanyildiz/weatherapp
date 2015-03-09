var app = angular.module('weatherApp', ['angularjs-dropdown-multiselect']);

app.controller('weatherCtrl', ['$scope', 'myDataService', function($scope, myDataService) {

    $scope.findWeather = function(city) {
        $scope.items = '';
        fetchWeather($scope,myDataService,city);
    };

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

    myDataService.getData('js/jsData/CitiesData.json').then(function(dataResponse){
        parseCityData($scope,dataResponse.data);
    });

    $scope.ddEvents = {
        onItemSelect: function(item){
            $scope.$emit('myCustomEvent', item.id);
        }
    };

}]);

app.directive('myDropdown', function(){
   return {
       restrict: 'A',
       link: function(scope,element,attr){
           scope.$on('myCustomEvent', function (event, itemID) {
               scope.findWeather(itemID);
           });
       }
   }
});

app.service('myDataService', ['$http', function ($http) {
    this.getData = function ($url) {
        return $http.get($url);
    };
}]);

// Global functions
function parseCityData(scopeVar,citiesData){
    for(var i in citiesData.data){
        scopeVar.citiesData.push({id: citiesData.data[i].ID, label: citiesData.data[i].Name});
    }
}

function fetchWeather(scopeVar,service,city) {
    var weatherQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+city+'")',
        weatherURL   = "http://query.yahooapis.com/v1/public/yql?q=" + weatherQuery + "&format=json&callback=";
    service.getData(weatherURL).then(function(dataResponse){
        scopeVar.place = dataResponse.data.query.results.channel;
    });
}

/*app.factory('cityAPIService', ['$http', '$q', function ($http, $q){

    var cityAPI = {};

    cityAPI.getCity = function() {
        var deferred = $q.defer(),
            url   = 'js/jsData/CitiesData.json';
        $http.get(url)
            .success(function(data){
                deferred.resolve(data);
            })
            .error(function(err){
                console.log('Error retrieving markets');
                deferred.reject(err);
            });
        return deferred.promise
    };

    return cityAPI;

}]);*/

/*app.factory('weatherAPIService', ['$http', '$q', '$myDataService', function ($http, $q, myDataService){

    var weatherAPI = {};

    weatherAPI.getWeather = function (city) {
        var deferred = $q.defer(),
            query    = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="'+city+'")',
            url      = "http://query.yahooapis.com/v1/public/yql?q=" + query + "&format=json&callback=";
        $http.get(url)
            .success(function(data){
                deferred.resolve(data.query.results.channel);
            })
            .error(function(err){
                console.log('Error retrieving markets');
                deferred.reject(err);
            });
        return deferred.promise;
    };

    return weatherAPI;

}]);*/
