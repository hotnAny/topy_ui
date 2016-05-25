/*------------------------------------------------------------------------------------*
 *
 * mouse event handlers for the operation in the various steps
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

gMouseCtrls.rotateSpeed = 5.0;
gMouseCtrls.zoomSpeed = 0.5;
gMouseCtrls.panSpeed = 2;

gMouseCtrls.noZoom = false;

gMouseCtrls.staticMoving = true;
gMouseCtrls.dynamicDampingFactor = 0.3;

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseup', onMouseUp, false);

function onMouseDown(e) {
	if (e.which != LEFTMOUSE) {
		return;
	}

	var objs = rayCast(e.clientX, e.clientY, gVoxels);
	if (objs.length > 0) {
		gSelGlued = !gSelGlued;
	}
}

function onMouseMove(e) {
	if (gSelGlued) {
		var objs = rayCast(e.clientX, e.clientY, gVoxels);
		// console.log(objs[0]);
		if (objs.length > 0) {
			var voxel = objs[0].object;

			setHighlight(voxel);
		}
	}
}

function onMouseUp(e) {

}

function setHighlight(mesh, toHighlight) {
	// if(mesh.highlighted) {
	// 	log('dehighlight')
	// 	mesh.highlighted = false;
	// } else {
	// 	log('highlight')
	// 	mesh.highlighted = true;
	// }

	// log(mesh.index)
	if (toHighlight) {
		if (mesh.material != MATERIALCONTRAST) {
			mesh.material = MATERIALCONTRAST;
			mesh.material.needsUpdate = true;
		}
	} else {
		if (mesh.material != MATERIALNORMAL) {
			mesh.material = MATERIALNORMAL;
			mesh.material.needsUpdate = true;
		}
	}

}