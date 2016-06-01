/*------------------------------------------------------------------------------------*
 *
 * variable (specific to toby) declaration and program initialization
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

"use strict"; 

// max number of elements
var MAXNUMELMS = 100;
var DIMVOXEL = 10;

// num of elements (voxels)
var gNumElms = new Array();

// which layer is slided to
var gIdxLayers = new Array();

//
// voxels
//
var gVoxels = [];
var gDimsVoxels = []; // the existing dimension of the voxel grid
var gBoundVoxels = [];
var gLoadVoxels = [];

class Voxel {
	constructor(mesh) {
		this._mesh = mesh;
		this._index = mesh.index;	// assuming the index is stored to the mesh when it is created

		this._isBoundary = false;
		this._fxtr = [];

		this._isLoad = false;
		this._loads = [];
	}

	setBoundary(axis) {
		this._fxtr[axis] = true;
		this._isBoundary = true;
	}

	setLoad(axis, amnt) {
		this._loads[axis] = amnt;
		this._isLoad = true;
	}

	get mesh() {
		return this._mesh;
	}

	get index() {
		return this._index;
	}

	get fxtr() {
		return this._fxtr;
	}

	get loads() {
		return this._loads;
	}
}

//
// mouse selection
//
var gMouseDown = false;
var gGlueState = false; // glue state for constantly selecting or deselecting voxels when dragging
var gVoxelsBoundary = []; // permanently buffer for selected voxels
var gVoxelsLoad = [];
var gSelVoxels = []; // temporary buffer for selected voxels
var gVoxelPrev; // last encountered voxel
var gIsSpecified;

//
// tpd file
//
var gTpd;
var PARAMSFORUI = [];
var UIOFPARAMS = [];