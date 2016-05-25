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

	gMouseDown = true;
	gGlueState = selectVoxel(e);
}

function onMouseMove(e) {
	if (gMouseDown) {
		selectVoxel(e, gGlueState);
	}
}

function onMouseUp(e) {
	gMouseDown = false;
}

function selectVoxel(e, alwaysHighlight) {
	var objs = rayCast(e.clientX, e.clientY, gVoxels);
	if (objs.length > 0) {
		var voxel = objs[0].object;
		if (setHighlight(voxel, alwaysHighlight)) {
			if (isVoxelSelected(voxel.index) == false) {
				gSelVoxels.push(voxel.index);
			}
			return true;
		}
	}
	return false;
}

function setHighlight(mesh, alwaysHighlight) {

	var toHighlight = alwaysHighlight == undefined ? !mesh.highlighted : alwaysHighlight;

	// if (mesh.highlighted || alwaysHighlight == false) {
	if (toHighlight) {
		if (mesh.material != MATERIALCONTRAST) {
			mesh.material = MATERIALCONTRAST;
			mesh.material.needsUpdate = true;
		}
		mesh.highlighted = true;
		return true;
		// } else if (!mesh.highlighted || alwaysHighlight == true) {
	} else {
		if (mesh.material != MATERIALNORMAL) {
			mesh.material = MATERIALNORMAL;
			mesh.material.needsUpdate = true;
		}
		mesh.highlighted = false;
		return false;
	}

}