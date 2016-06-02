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
	gSelVoxels.splice(0, gSelVoxels.length);

	// if the first clicked-on voxel is selected, the subsequent operation is to deselect voxels; vice versa
	gSelectionMode = selectVoxel(e);
}

function onMouseMove(e) {
	if (gMouseDown) {
		selectVoxel(e, gSelectionMode);
	}
}

function onMouseUp(e) {
	if (gMouseDown) {
		if (gSelectionMode == SELECTION) { // if it's a selection operation
			dlgBoundLoad.dialog('open');
		} else {
			updateSpecialVoxels()
		}
	}
	gMouseDown = false;
}

//
// subroutine for selecting a voxel, specific to topy_ui
//
function selectVoxel(e, selectionMode) {
	var objs = rayCast(e.clientX, e.clientY, gVoxels);
	if (objs.length > 0) {
		var mesh = objs[0].object;
		var highlighted = undefined;

		switch (selectionMode) {
			case SELECTION: // always be selecting
				highlighted = setHighlight(mesh, true);
				break;
			case DESELECTION: // always be deselecting
				highlighted = setHighlight(mesh, false);
				break;
			default: // select unhighlighted and deselect highlighted; and return it as a mode
				highlighted = setHighlight(mesh);
				break;
		}

		if (highlighted == true) {
			if (isVoxelSelected(mesh.index) == false) { // if currently not highlighted into the temp buffer
				var voxel = new Voxel(mesh)
				gSelVoxels.push(voxel);
			}
		} else if (highlighted == false) {
			var voxel = retrieveVoxel(mesh.index);
			if (voxel != undefined) {
				if (voxel.isBoundary) {
					removeFromArray(gBoundVoxels, voxel);
				}

				if (voxel.isLoad) {
					removeFromArray(gLoadVoxels, voxel);
				}
			}
		}

		return highlighted ? SELECTION : DESELECTION;
	}
}

function retrieveVoxel(index) {
	var specialVoxels = gBoundVoxels.concat(gLoadVoxels);
	for (var i = specialVoxels.length - 1; i >= 0; i--) {
		var isMatch = true;
		for (var j = 0; j < index.length; j++) {
			if (index[j] != specialVoxels[i].index[j]) {
				isMatch = false;
				break;
			}
		}

		if (isMatch) {
			return specialVoxels[i];
		}
	}
	return undefined;
}

//
//	set a designated mesh highlight by changing the material property
//
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
//	tell if a voxel has already been highlighted by the mouse operation
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