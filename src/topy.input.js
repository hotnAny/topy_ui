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
	if (e.which != LEFTMOUSE || dlgBoundLoad.dialog('isOpen') == true) {
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
	if (gGlueState) { // if it's a selection operation
		// show prompt
		dlgBoundLoad.dialog('open');
	}
	gMouseDown = false;
}

//
// subroutine for selecting a voxel, specific to topy_ui
//
function selectVoxel(e, alwaysHighlight) {
	var objs = rayCast(e.clientX, e.clientY, gVoxels);
	if (objs.length > 0) {
		var voxel = new Voxel(objs[0].object)
			// var voxel = objs[0].object;
		if (setHighlight(voxel.mesh, alwaysHighlight)) {
			if (isVoxelSelected(voxel.index) == false) { // if currently not selected
				gSelVoxels.push(voxel);
			}
			return true;
		} else { // remove it from permenante storage
			var storage;
			if (voxel.isBoundary) {
			}

			if (voxel.isLoad) {
			}

			
		}
	}
	return false;
}

function setHighlight(mesh, alwaysHighlight) {

	var toHighlight = alwaysHighlight == undefined ? !mesh.highlighted : alwaysHighlight;

	if (toHighlight) {
		if (mesh.material != MATERIALCONTRAST) {
			mesh.material = MATERIALCONTRAST;
			mesh.material.needsUpdate = true;
		}
		mesh.highlighted = true;
		return true;
	} else {
		if (mesh.material != MATERIALNORMAL) {
			mesh.material = MATERIALNORMAL;
			mesh.material.needsUpdate = true;
		}
		mesh.highlighted = false;
		return false;
	}

}

//
//	tell if a voxel has already been selected by the mouse operation
//
function isVoxelSelected(index) {
	for (var i = 0; i < gSelVoxels.length; i++) {
		var isMatch = true;
		for (var j = 0; j < index.length; j++) {
			if (index[j] != gSelVoxels[i].index[j]) {
				isMatch = false;
				break;
			}
		}

		if (isMatch) {
			return true;
		}
	}

	return false;
}