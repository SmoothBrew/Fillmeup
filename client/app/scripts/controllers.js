'use strict';

angular.module('Client.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  // create a google maps geocoder
  var geocoder = new google.maps.Geocoder();

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe(true, 'splash');
  };

  $scope.centerOnMe = function (showOrHideBackdrop, templateName) {
    console.log('Centering');
    if (!$scope.map) {
      return;
    }

    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: showOrHideBackdrop,
      templateUrl: '/templates/' + templateName + '.html'
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      // get latitude and longitude position
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;
      // // reverse geo-code this position into an address
      // // to use in GET request to server (for yelp API)
      var latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({'latLng': latlng}, function(results, status) {
        console.log('geocoder results are: ', results);
        console.log('geocoder status is: ', status);
        if( status == google.maps.GeocoderStatus.OK) {
          console.log('geocoding ok');
          if(results[1]) {
            console.log('reverse geocode results are: ', results);
          }
        }
      });

      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
