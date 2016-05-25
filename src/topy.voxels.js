//
// create or update a voxel grid based on the number of elements on each axis
//
// @param nElms: an array containing numbers of elements on X, Y and Z
//
function updateVoxels(nElms) {
	// re-create the voxel grid
	var nx = nElms[0];
	var ny = nElms[1];
	var nz = nElms[2];

	if (nx <= 1 || ny <= 1 || nz <= 1) {
		return false;
	}

	for (var i = 0; i < gVoxels.length; i++) {
		scene.remove(gVoxels[i]);
	}

	gVoxels.splice(0, gVoxels.length);

	var idx = 0;
	for (var i = 0; i < nx; i++) {
		for (var j = 0; j < ny; j++) {
			for (var k = 0; k < nz; k++) {
				idx = i * (ny * nz) + j * nz + k;
				if (i == nx - 1 || i == 0 || j == ny - 1 || j == 0 || k == nz - 1 || k == 0) {
					var index = [i, j, k];
					var mat = isVoxelSelected(index) ? MATERIALCONTRAST : MATERIALNORMAL;
					var voxel = makeVoxel(DIMVOXEL, -i, j, k, mat);
					voxel.index = index;
					scene.add(voxel)

					gVoxels.push(voxel);
				}
			} // z	
		} // y
	} // x


	// gVoxels.splice(idx + 1, gVoxels.length - idx - 1);

	// reinstate those that are selected as boundary and/or loads, if they are still valid
}

//
//	make a cubical voxel (dim x dim x dim) situated at (i * dim, j * dim, k * dim)
//	
//	@param	(i, j, k): the index of the voxel
//	@param	dim: the size of the voxel
//	@param	noMargin: set to true if wanting voxels to be right next to one another with no margin
//
function makeVoxel(dim, i, j, k, mat, noMargin) {
	var geometry = new THREE.BoxGeometry(dim, dim, dim);
	var material = new THREE.MeshBasicMaterial({
		color: COLORNORMAL,
		transparent: true,
		opacity: 0.25,
		// wireframe: true
	});
	var voxel = new THREE.Mesh(geometry, mat);

	// leave some margin between voxels
	if (noMargin) {} else {
		dim += 1
	}

	voxel.position.set((i + 0.5) * dim, (j + 0.5) * dim, (k + 0.5) * dim);

	return voxel;
}

function isVoxelSelected(index) {
	for (var i = 0; i < gSelVoxels.length; i++) {
		var isMatch = true;
		for (var j = 0; j < index.length; j++) {
			if(index[j] != gSelVoxels[i][j]) {
				isMatch = false;
				break;
			}
		}

		if(isMatch) {
			return true;
		}
	}

	return false;
}