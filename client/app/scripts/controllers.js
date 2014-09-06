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

  // helper function to place markers (move into utility file/service eventually?)
  $scope.placeMarkers = function(businesses){
    // business is Yelp data which includes address to reverse geocode
    businesses.forEach(function(business){
      // get address to geocode
      var address = business.location.address[0] + ', ' + business.location.city + ', ' + business.location.state_code;
      // geocode address
      geocoder.geocode({'address': address}, function(results, status) {

        if(status === google.maps.GeocoderStatus.OK) {
          
          var markerPosition = new google.maps.LatLng(results[0].geometry.location.k, results[0].geometry.location.B);
          var marker = new google.maps.Marker({
            position: markerPosition,
            map: $scope.map,
            title: business.businessName,
            icon: image
          });
        
        }

      });

      // var markerPosition = new google.maps.LatLng(business.location.coordinate.latitude, business.location.coordinate.longitude);
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
        console.log('geocoder results are: ', results);
        console.log('geocoder status is: ', status);
        
        if(status === google.maps.GeocoderStatus.OK) {
          console.log('geocoding OK');
          
          //make GET request to server with position
          var url = 'http://127.0.0.1:8000/cafe?lat=' + lat + '&lng=' + lng + '&address=' + results[0].formatted_address;

          $http({ method: 'GET', url: url})
            .success(function(data, status, headers, config) {

              console.log('data is: ', data);
          
                $scope.placeMarkers(data);

            })
            .error(function(data, status, headers, config) {

            });
        }

      });

      // test placeMarkers 
      var business_obj = {
        businessName: "coffee shop",
        location: {
          coordinate : {
            latitude: 37.7871857999999,
            longitude: -122.4216424999
          }
        }
      }
      var businessArr = [];
      businessArr.push(business_obj);
      $scope.placeMarkers(businessArr);
      

      // Reverse Geocode position to get address


    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});


/*

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
            // $http.post('http://127.0.0.1:8000/cafe', results[1][0])
            //   .success(function(data, status, headers, config) {
            //     console.log('success post request');
            //   })
            //   .error(function(data, status, headers, config) {
            //     console.log('error post request');
            //   });
          }
        }
      });
      //set map to the new google map centered on user's position
      $scope.map.setCenter(latlng);

      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});



*/






