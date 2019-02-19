var extrudeSettings;
var bigData = [];
function GenerateLines(){
	if(isfilled){
		//Three.js
		for(var i = 0; i < scene.children.length; i++){
			var obj = scene.children[i];
			if( obj.name == "mesh"){
				scene.remove(obj);
				i--;
			}
		}
		//VTK.js
		renderervtk.removeAllViewProps();
		renderervtk.addActor(actorP);
		renderervtk.resetCamera();
		windowRender.render();
	}
	while ( isNaN(num) | num < 1) {
		num = prompt("Invalid number: Please Retry", "5");
		num = parseInt(num);
	}
	var text = "epis";
	var url = "http://davim.cs.uh.edu/flowvis/api.php?service=getStreamline&numb=" + num;
	// get function JQuery
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		text = this.responseXML.body.innerHTML;
		sub();
	}
	xhr.open("GET", url);
	xhr.responseType = "document";
	xhr.send();
	
	function sub() {
		var lineData = [];
		var lineData2 = [];
		var prevPos = 0;
		var tempVal = 0;
		var counter = 0;
		var counter2 = 0;
		var lineCounter = 0;
		var x = 0;
		var y = 0;
		var z = 0;
		for(var a = 0; a < text.length; a++){
			if(text.charAt(a)==' '){
				//Three.js
				counter++;
				tempVal = Number(text.substring(prevPos, a));
				prevPos = a+1;
				if(counter == 1){
					x = tempVal;
				}
				else if(counter == 2){
					y = tempVal;
				}
				else if(counter == 3){
					z = tempVal;
					lineData.push(new THREE.Vector3(x,y,z));
					counter = 0;
				}
				//vtk.js
				lineData2[counter2] = tempVal;
				counter2++;
			}
			else if(text.charAt(a) == ','){
				//Three.js
				tempVal = Number(text.substring(prevPos, a));
				z = tempVal;
				lineData.push(new THREE.Vector3(x,y,z));
				var draw = new THREE.CatmullRomCurve3( lineData );
				bigData[lineCounter] = draw;
				lineCounter++;
				extrudeSettings = {
					steps: 40,
					bevelEnabled: false,
					extrudePath: draw
				};
				var geo = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );
				var mat = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff , wireframe: false } );
				var mesh = new THREE.Mesh( geo, mat );
				mesh.name = "mesh";
				mesh.position.set(-64, -16, -32);
				scene.add( mesh );
				lineData = [];
				
				//VTK.js
 				lineData2[counter2] = tempVal;
				counter2++;
				var pointData = new Float32Array(3 * (counter2 + 1));
				var verts = new Uint32Array(2 * (counter2 + 1));
				var lines = new Uint32Array(counter2 + 2);
				lines[0] = counter2 + 1;
				var scalarsData = new Float32Array(counter2 + 1);
				var scalars = vtk.Common.Core.vtkDataArray.newInstance({
					name: 'Scalars',
					values: scalarsData,
				});
				var polyData = vtk.Common.DataModel.vtkPolyData.newInstance();
				var points = vtk.Common.Core.vtkPoints.newInstance();
				points.setNumberOfPoints(counter2 + 1);
				for (let i = 0; i < counter2 + 1; ++i) {
					for(let j=0; j<3; j++){
						pointData[3*i+j] = lineData2[3*i+j];
					}
				scalarsData[i] = i * 0.01;
				verts[i] = 1;
				verts[i + 1] = i;
				lines[i + 1] = i;
				}
				points.setData(lineData2);
				polyData.setPoints(points);
				polyData.getVerts().setData(verts);
				polyData.getLines().setData(lines);
				polyData.getPointData().setScalars(scalars);
				
				var tuber = vtk.Filters.General.vtkTubeFilter.newInstance();
				tuber.setInputData(polyData);
				tuber.setInputArrayToProcess(0, 'Scalars', 'PointData', 'Scalars');
				
				var mapper = vtk.Rendering.Core.vtkMapper.newInstance();
				mapper.setInputConnection(tuber.getOutputPort());
				var actor = vtk.Rendering.Core.vtkActor.newInstance();
				actor.setMapper(mapper);
				renderervtk.addActor(actor);
			
				var mapper2 = vtk.Rendering.Core.vtkMapper.newInstance();
				mapper2.setInputData(polyData);
				var actor2 = vtk.Rendering.Core.vtkActor.newInstance();
				actor2.setMapper(mapper2);
				renderervtk.addActor(actor2);
				lineData2 = [];
				counter = 0;
				counter2 = 0;
				prevPos = a+1;
			}
		}
		//VTK.js
		renderervtk.resetCamera();
		windowRender.render();
		isfilled = true;
	};
};