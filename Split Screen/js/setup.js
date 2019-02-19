var three = $("<div id = 'three'></div>");
$("body").append(three);
$(three).innerHeight(window.innerHeight);
//$(three).innerWidth((2*window.innerWidth)/5);
$(three).innerWidth(window.innerWidth/3);
var taxis = $("<div id = 'inset'></div>");
$("body").append(taxis);

//-----Three.js Setup-----//
container = document.createElement( 'div' );
document.getElementById( 'three' ).appendChild( container );
stats = new Stats();
container.appendChild( stats.dom );
//Scene Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/3)/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
//renderer.setSize( (2*window.innerWidth)/5, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize( (window.innerWidth)/3, window.innerHeight );
scene.background = new THREE.Color('white');
container.appendChild( renderer.domElement );

var circleRadius = 1;
var circleShape = new THREE.Shape();
circleShape.moveTo( 0, circleRadius );
circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );

var light = new THREE.AmbientLight(0x777777);
//light.position.set(32,0,0)
scene.add(light);
var light2 = new THREE.PointLight(0xffffff);
light2.position.set(-32,0,0)
scene.add(light2);

var controls = new THREE.TrackballControls( camera, document.getElementById("three"));
controls.enableKeys = false;

//axis
var axes = document.getElementById( 'inset' );
var renderer2 = new THREE.WebGLRenderer();
renderer2.setClearColor( 0x000000, 1 );
renderer2.setSize( 50, 50 );
axes.appendChild( renderer2.domElement );
var scene2 = new THREE.Scene();
var camera2 = new THREE.PerspectiveCamera( 50, 1, 1, 1000 );
camera2.up = camera.up;
var axesHelper = new THREE.AxesHelper( 5 );
scene2.add( axesHelper );

//box
var geometry = new THREE.BoxGeometry( 128, 32, 64);
var edge = new THREE.EdgesGeometry( geometry );
var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
var wireframe = new THREE.LineSegments( edge, mat );
scene.add( wireframe );

camera.position.set( 0, 0, 200);
controls.update();

var animate = function () {
	requestAnimationFrame( animate );
	controls.update();
	camera2.position.copy( camera.position );
	camera2.position.sub( controls.target );
	camera2.position.setLength( 15 );
    camera2.lookAt( scene2.position );
	stats.begin();
	renderer.render( scene, camera );
	stats.end();
	renderer2.render( scene2, camera2 );
};
$("body").append($("<p>Works</p>"));
animate();

//-----VTK.js-----//
//Scene Setup
var fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({background : [1,1,1],});
//WireBox
var box = vtk.Filters.Sources.vtkCubeSource.newInstance({ xLength: 128, yLength: 32, zLength: 64 });
var actorP = vtk.Rendering.Core.vtkActor.newInstance();
var mapperP = vtk.Rendering.Core.vtkMapper.newInstance();
mapperP.setInputConnection(box.getOutputPort());
actorP.setMapper(mapperP);
actorP.setPosition(64, 16, 32);
actorP.getProperty().setRepresentationToWireframe();
//Rendering
var renderervtk = fullScreenRenderer.getRenderer();
var windowRender = fullScreenRenderer.getRenderWindow();
//Axes
var renderWindowInteractor = vtk.Rendering.Core.vtkRenderWindowInteractor.newInstance();
renderWindowInteractor.setRenderWindow(windowRender);
var axes = vtk.Rendering.Core.vtkAxesActor.newInstance();
var widget = vtk.Interaction.Widgets.vtkOrientationMarkerWidget.newInstance({
	actor: axes,
	interactor: windowRender.getInteractor(),
});
widget.setEnabled(true);
widget.setViewportCorner(vtk.Interaction.Widgets.vtkOrientationMarkerWidget.Corners.BOTTOM_LEFT);
widget.setViewportSize(0.15);
widget.setMinPixelSize(100);
widget.setMaxPixelSize(300);

renderervtk.addActor(actorP);
renderervtk.resetCamera();
windowRender.render();
  
//FPS GUI
var fps = vtk.Interaction.UI.vtkFPSMonitor.newInstance();
var fpsCont = fps.getFpsMonitorContainer();
fpsCont.style.position = 'absolute';
fpsCont.style.margin = ((2*window.innerWidth)/5).toString + " px";
fpsCont.style.color = 'black';
fpsCont.style.background = 'rgba(255,255,255,0.5)';
fps.setContainer(document.querySelector('body'));
fps.setRenderWindow(windowRender);
windowRender.render();