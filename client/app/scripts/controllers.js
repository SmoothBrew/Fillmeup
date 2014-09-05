'use strict';

angular.module('Client.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
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
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.logIn = function(){
    console.log('Logging in...');
  };

});
