/*------------------------------------------------------------------------------------*
 *
 * variable (specific to toby) declaration and program initialization
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

// max number of elements
var MAXNUMELMS = 100;
var DIMVOXEL = 10;

// num of elements (voxels)
var gNumElms = new Array();

// which layer is slided to
var gIdxLayers = new Array();

var gVoxels = [];
var gDimsVoxels = []; // the existing dimension of the voxel grid

// mouse selection
var gMouseDown = false;
var gGlueState = false; // glue state for constantly selecting or deselecting voxels when dragging
var gSelVoxels = []; // temporary buffer for selected voxels
var gVoxelPrev; // last encountered voxel