module.exports.Scene = function(container) {
  var $container = $(container);
  var width = $container.width();
  var height = $container.height();
  var _this = this;

  // Create scene
  var scene = new THREE.Scene();

  // Create camera
  var left = width / -200;
  var right = width / 200;
  var top = height / 200;
  var bottom = height / -200;
  var near = 0.001;
  var far = 1000;
  var camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  camera.position.set(0, 3.0, 1.2);
  camera.lookAt(new THREE.Vector3(10,50,5));

  var controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  // Create and append renderer
  var renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);
  renderer.autoClear = false;
  $container.append(renderer.domElement);

  // Create lights
  var ambientLight = new THREE.AmbientLight(0x222222);

  var mainLight = new THREE.DirectionalLight(0xffffff, 0.8)
  mainLight.position.set(1,2,4).normalize();

  var auxLight = new THREE.DirectionalLight(0xffffff, 0.3);
  auxLight.position.set(-4,-1,-2).normalize;

  // Add everything to the scene
  scene.add(ambientLight);
  scene.add(mainLight);
  scene.add(auxLight);
  scene.add(camera);

  // Set props for return object
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
    controls.update();
    _this.renderer.render(_this.scene, _this.camera);
  };
};