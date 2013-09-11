var Scene = function(container) {
  var $container = $(container);
  var width = $container.width();
  var height = $container.height();
  var _this = this;

  //create scene
  var scene = new THREE.Scene();

  //create camera
  var view_angle = 45;
  var aspect = width/height;
  var near = 0.1;
  var far = 10000;
  var camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
  camera.position.z = 300;


  //create renderer
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  //append rendered scene to the dom
  $container.append(renderer.domElement);

  //create lights
  var pointLight = new THREE.PointLight(0xFFFFFF);
  //set it's position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  //add it to scene
  scene.add(pointLight);
  scene.add(camera);

  //set props for return object
  this.camera =   camera;
  this.renderer = renderer;
  this.scene =     scene;

  this.add = function(object) {
    scene.add(object);
  };
  this.animate = function(callback) {
    requestAnimationFrame(function() {
      _this.animate(callback);
    });
    if ( typeof callback === 'function') {
      callback();
    }
    _this.renderer.render(_this.scene, _this.camera);
  };
};