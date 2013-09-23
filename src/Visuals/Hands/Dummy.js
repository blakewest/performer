//this is our 'Dummy' finger, so that we can book-end the Hand 'children' arrays, and not have to write janky neighbor note code.
var Dummy = module.exports.Dummy = function() {
  var Geometry = new THREE.CubeGeometry(1,1,1);
  var Material = new THREE.MeshLambertMaterial({color: 0x0000});
  var Position = new THREE.Vector3(0, 0, 0);
  this.model = new THREE.Mesh(Geometry, Material);
  this.model.position.copy(Position);
  this.model.visible = false;
};
