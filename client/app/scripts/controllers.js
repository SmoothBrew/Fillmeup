'use strict';

angular.module('Client.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $http) {


  // create a google maps geocoder object
  var geocoder = new google.maps.Geocoder();

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe(true, 'splash');
  };

  // creates proper icon for google maps marker
  var image = {
    url: '../images/coffee.png',
    size: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(10, 10)
  };

  var shape = {
    coords: [3, 2, 20, 2, 20, 14, 3, 14],
    type: 'poly'
  };

  $scope.openInfoWindow = null;
  $scope.highestRated = {};

  // helper function to place markers (move into utility file/service eventually?)
  $scope.placeMarkers = function(businesses){
    // business is Yelp data which includes address to reverse geocode
    businesses.forEach(function(business){
      console.log('business is: ', business);
      // get address to geocode
      var address = business.location.address[0] + ', ' + business.location.city + ', ' + business.location.state_code;
      // geocode address
      geocoder.geocode({'address': address}, function(results, status) {
        if(status === google.maps.GeocoderStatus.OK) { 
           
          var markerPosition = new google.maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.B);
          var calculateDistance = new google.maps.DistanceMatrixService();
          calculateDistance.getDistanceMatrix({
            origins: [$scope.myPosition],
            destinations: [markerPosition],
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, function(response, status){

            if(status === google.maps.GeocoderStatus.OK) { 
              business.distance = response.rows[0].elements[0].distance.text;

              // add info box w/ distance, rating and business name
              var contentString = '<div class="infoWindow">'+
              '<h4>' + business.businessName + '</h4>' +
              '<div class="rating">' + 'Rating: ' + business.rating + '/5' + '</div>' +
              '<div class="distance">' + 'Distance: ' + business.distance + '</div>' +
              '</div>';

              var infoWindow = new google.maps.InfoWindow({
                content: contentString
              });

              if(!$scope.highestRated.rating || $scope.highestRated.rating < business.rating){
                $scope.highestRated = business;
                $scope.$digest();
              }

              var marker = new google.maps.Marker({
                position: markerPosition,
                map: $scope.map,
                title: business.businessName,
                icon: image,
                shape: shape
              });

              // add event listener for marker
              google.maps.event.addListener(marker, 'click', function(){
                if($scope.openInfoWindow){
                  $scope.openInfoWindow.close();
                }
                $scope.openInfoWindow = infoWindow;
                $scope.openInfoWindow.open($scope.map, marker);
              });

              if(business === $scope.highestRated){
                google.maps.event.trigger(marker, 'click');
              }

            }

          });

        }

      });
    });
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

      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;

        // add user location pin drop
      var userPosition = new google.maps.LatLng(lat, lng);

      var userMarker = new google.maps.Marker({
        position: userPosition,
        map: $scope.map,
        title: 'user',
      });


      $scope.myPosition = new google.maps.LatLng(lat, lng);
      $scope.map.setCenter($scope.myPosition);
      $ionicLoading.hide();

      geocoder.geocode({'latLng': $scope.myPosition}, function(results, status) {
        
        if(status === google.maps.GeocoderStatus.OK) {
          console.log('geocoding OK');
          
          //make GET request to server with position
          var url = 'http://127.0.0.1:8000/cafe?lat=' + lat + '&lng=' + lng + '&address=' + results[0].formatted_address;

          $http({ method: 'GET', url: url})
            .success(function(data, status, headers, config) {
                $scope.placeMarkers(data);
            })
            .error(function(data, status, headers, config) {
              console.log('error with GET request to /cafe');
            });
        }

      });

    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
