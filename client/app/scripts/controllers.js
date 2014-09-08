'use strict';

angular.module('Client.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading, $http) {

  var assignName = function(nameStr) {
    $scope.topRated.name = nameStr;
  }

  $scope.topRated = {
      marker: null,
      rating: 0
    };
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

  // helper function to place markers (move into utility file/service eventually?)
  $scope.placeMarkers = function(businesses){
    var topBusinessName = '';
    var counter = 0;
    // store top rated marker here
    // business is Yelp data which includes address to reverse geocode
    businesses.forEach(function(business){
      console.log('business is: ', business);
      // get address to geocode
      var address = business.location.address[0] + ', ' + business.location.city + ', ' + business.location.state_code;
      // geocode address
      geocoder.geocode({'address': address}, function(results, status) {
        counter++;
        if(status === google.maps.GeocoderStatus.OK) { 
          var markerPosition = new google.maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.B);
          var marker = new google.maps.Marker({
            position: markerPosition,
            map: $scope.map,
            title: business.businessName,
            icon: image,
          });

          var infoContent = '<h3>' + business.businessName + '</h3>' + business.rating;
          // create infowindow
          var infowindow = new google.maps.InfoWindow({
            content: infoContent
          });
          // add click event listener to marker
          google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open($scope.map, marker);
          });
          // check rating against toprated marker, and if higher
          if(business.rating > $scope.topRated.rating) {
            $scope.topRated.marker = marker;
            $scope.topRated.rating = business.rating;
            topBusinessName = business.businessName;

          }
          // if at last business in businesses array, add animation to marker w/ highest rating
          //add animation        
          if(counter === businesses.length) {
            $scope.topRated.marker.setAnimation(google.maps.Animation.BOUNCE);
            // assignName(topBusinessName);
            $scope.topRated.name = topBusinessName;
            console.log('scope.topRated.name is: ', $scope.topRated.name);
            console.log('topBusinessName is: ', topBusinessName);

          }
        }
      });  // end of forEach
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

      var myPosition = new google.maps.LatLng(lat, lng);
      $scope.map.setCenter(myPosition);
      $ionicLoading.hide();

      geocoder.geocode({ 'latLng': myPosition}, function(results, status) {
        
        if(status === google.maps.GeocoderStatus.OK) {
          console.log('geocoding OK');
          
          //make GET request to server with position
          var url = 'http://127.0.0.1:8000/cafe?lat=' + lat + '&lng=' + lng + '&address=' + results[0].formatted_address;

          $http({ method: 'GET', url: url})
            .success(function(data, status, headers, config) {
                console.log('console.log from success: ', $scope.placeMarkers(data));


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