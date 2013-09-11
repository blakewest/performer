var Scene = function(container) {
  var $container = $(container);
  var width = $container.width();
  var height = $container.height();

  //create scene
  var scene = new THREE.Scene();

  //create camera
  var view_angle = 45;
  var aspect = width/height;
  var near = 0.1;
  var far = 10000;
  var camera = new THREE.PerspectiveCamera(view_angle, aspect, near, far);

  scene.add(camera);

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


}