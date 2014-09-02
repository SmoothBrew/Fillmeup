'use strict';

angular.module('Client.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  $scope.mapCreated = function(map) {
    $scope.map = map;
    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: true,
      templateUrl: '/templates/splash.html'
    });
    $scope.centerOnMe();
  };

  $scope.recenter = function() {
    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false,
      templateUrl: '/templates/loading.html'
    });
    $scope.centerOnMe();
  }

  $scope.centerOnMe = function () {
    console.log('Centering');
    if (!$scope.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };
});
