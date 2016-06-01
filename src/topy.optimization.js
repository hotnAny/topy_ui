//
//	precomputing a tpd file for topology optimization
//
//	@param mesh - the initial volume to be optimized 
//	(e.g., a connector made from a sphere with space carved out for the things it connects)
//	@param boundaryVertices - vertices specified as boundary
//	@param loadVertices - vertices specified as sustaining loads
//	@param loadAmnts - amounts of load corresponding to loadVertices
//
function preCompTpd(mesh, boundaryVertices, loadVertices, loadAmnts) {

}

//
// based on topy's nodenums.py
//
function elm2nodes(nelx, nely, nelz, mpx, mpy, mpz) {
	var innback = [0, 1, nely + 1, nely + 2];
	var enback = nely * (mpx - 1) + mpy;

	var nnback = addScalar(innback, enback + mpx - 1);
	var nnfront = addScalar(nnback, (nelx + 1) * (nely + 1));
	var nn = addScalar(nnfront.concat(nnback), (mpz - 1) * (nelx + 1) * (nely + 1));
	log('Node numbers for 3D element at position x =' + mpx + ',' + 'y =' + mpy + 'and z =' + mpz + ':\n' + nn);
	log('Element number =' + (enback + nelx * nely * (mpz - 1)));
	log('Highest node number in domain =' + ((nelx + 1) * (nely + 1) * (nelz + 1)));
	return nn;
}

function addScalar(array, s) {
	var array2 = [];
	for (var i = array.length - 1; i >= 0; i--) {
		array2.push(array[i] + s);
	}
	return array2;
}