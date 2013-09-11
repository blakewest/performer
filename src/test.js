var Test = function() {
  var radius = 50;
  var segments = 16;
  var rings = 16;
  var _this = this;

  var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);
  var sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xCC0000} );

  this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  this.update = function() {
    _this.sphere.position.x += 1;
  };
}