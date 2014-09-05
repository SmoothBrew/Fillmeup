'use strict';

angular.module('Client.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe(true, 'splash');
  };

  // helper function to place markers (move into utility file/service eventually?)
  $scope.placeMarkers = function(businesses){
    businesses.forEach(function(business){
      var markerPosition = new google.maps.LatLng(business.latitude, business.longitude);
      var marker = new google.maps.Marker({
        position: markerPosition,
        map: $scope.map,
        title: business.businessName
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
      var MyPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      $scope.map.setCenter(MyPosition);

      $scope.placeMarkers([{businessName: "coffee", latitude: 37.7841, longitude:-122.410}]);

      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
