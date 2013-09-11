var Scene = function(container) {
  console.log('scene builder called');
  var $container = $(container);
  var width = $container.width();
  var height = $container.height();
  var _this = this;

  //create scene
  var scene = new THREE.Scene();

  //create camera
  var view_angle = 60;
  var aspect = width/height;
  var near = 0.001;
  var far = 100000;
  var camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);
  camera.lookAt(new THREE.Vector3());
  camera.position.z = 20;


  //create and append renderer
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);
  renderer.autoClear = false;
  $container.append(renderer.domElement);

  //create lights
  var ambientLight = new THREE.AmbientLight(0x222222);

  var mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(1,2,4).normalize();

  var auxLight = new THREE.DirectionalLight(0xffffff, 0.3);
  auxLight.position.set(-4,-1,-2).normalize;

  //add everything to the scene
  scene.add(ambientLight);
  scene.add(mainLight);
  scene.add(auxLight);
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