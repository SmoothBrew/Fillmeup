'use strict';

describe('Controller: MapCtrl', function () {

  var should = chai.should();

  // load the controller's module
  beforeEach(module('Client'));

  var MapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MapCtrl = $controller('MapCtrl', {
      $scope: scope
    });
  }));

  it('should have a mapCreated function', function () {
    expect(scope.mapCreated).to.be.a('function');
  });

  it('should have a centerOnMe function', function () {
    expect(scope.centerOnMe).to.be.a('function');
  });

  it('should take parameters showOrHideBackdrop (bool) and templateUrl (string)', function () {
    var spy = sinon.spy(scope, "centerOnMe");
    scope.centerOnMe(true, 'splash');
    expect(spy.callCount).to.equal(1);
  });

  it('should center the map when map is first created', function () {
    var spy = sinon.spy(scope, "centerOnMe");
    scope.mapCreated('test');
    expect(spy.callCount).to.equal(1);
  });

  it('should create a map property on scope when createdMap is run', function () {
    scope.mapCreated('test');
    expect(scope.map).to.exist;
  });

});
