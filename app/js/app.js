var app = angular.module('weatherApp', ['angularjs-dropdown-multiselect' ])

.controller('weatherCtrl', ['$scope', 'cityService', 'weatherService', function($scope, cityService, weatherService) {

    $scope.findWeather = function(city) {
        $scope.items = '';
        fetchWeather(city);
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

    cityService.getCity().then(function(data){
        parseCityData(data);
    });

    function parseCityData(citiesData){
        for(var i in citiesData.data){
            $scope.citiesData.push({id: citiesData.data[i].ID, label: citiesData.data[i].Name});
        }
    }

    function fetchWeather(city) {
        weatherService.getWeather(city).then(function(data){
            $scope.place = data;
        });
    }

    $scope.ddEvents = {
        onItemSelect: function(item){
            $scope.findWeather(item.id);
        }
    };

}])

.factory('cityService', ['$http', '$q', function ($http, $q){
    function getCity () {
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
    }

    return {
        getCity: getCity
    };
}])


.factory('weatherService', ['$http', '$q', function ($http, $q){
    function getWeather (city) {
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
    }

    return {
        getWeather: getWeather
    };
}]);
