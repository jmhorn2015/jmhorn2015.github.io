function SettingThreeRadius(){
	var counter = 0;
	for(var i = 0; i < scene.children.length; i++){
		var obj = scene.children[i];
		if( obj.name == "mesh"){
			circleShape = new THREE.Shape();
			circleShape.moveTo( 0, circleRadius );
			circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
			circleShape.quadraticCurveTo( circleRadius, - circleRadius, 0, - circleRadius );
			circleShape.quadraticCurveTo( - circleRadius, - circleRadius, - circleRadius, 0 );
			circleShape.quadraticCurveTo( - circleRadius, circleRadius, 0, circleRadius );
			extrudeSettings.extrudePath = bigData[counter];
			counter++;
			obj.geometry = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );
		}
	}
};
function SettingThreeSteps(){
	var counter = 0;
	for(var i = 0; i < scene.children.length; i++){
		var obj = scene.children[i];
		if( obj.name == "mesh"){
			extrudeSettings.steps = steps;
			extrudeSettings.extrudePath = bigData[counter];
			counter++;
			obj.geometry = new THREE.ExtrudeBufferGeometry( circleShape, extrudeSettings );
		}
	}
};