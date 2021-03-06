/*------------------------------------------------------------------------------------*
 *
 * useful recurring routines
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

function log(msg) {
	console.log(msg);
}

/*
	load models from stl binary/ascii data
*/
function loadStl(data) {
	var stlLoader = new THREE.STLLoader();
	var geometry = stlLoader.parse(data);
	var object = new THREE.Mesh(geometry, MATERIALNORMAL);
	scene.add(object);

	var dims = getBoundingBoxDimensions(object);
	var ctr = getBoundingBoxCenter(object);

	// reposition the ground & grid
	gGround.position.y -= dims[1] * 0.55;

	scene.remove(gGrid);
	gGrid = drawGrid(dims[1] * 0.55);
	scene.add(gGrid);

	// relocate the camera
	var r = Math.max(25, getBoundingSphereRadius(object));
	camera.position.copy(gPosCam.clone().normalize().multiplyScalar(r * 2));

	// re-lookAt for the camera
	gMouseCtrls.target = new THREE.Vector3(0, 0, 0);
	// camera.position.y = 0;

	// store the object
	objects.push(object);

}

function callTopy(topyPath, tpdPath) {
	pingServer('localhost', '9999', ['tpd'], [topyPath]);
}


/*
	setting up http request sender
*/
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		log(xmlhttp.responseText);
	}
}

/*
	actually sending web sockets to ping the improv server
*/
function pingServer(host, port, keys, values) {
	var prefix = "http://";
	xmlhttp.open("POST", prefix + host + ":" + port, true);
	xmlhttp.setRequestHeader("Content-type", "text/html");
	xmlhttp.timeout = 3000;

	var strMsg = '?';
	if (keys == undefined || values == undefined) {
		xmlhttp.send();
	} else {
		for (var i = 0; i < keys.length; i++) {
			strMsg += keys[i] + '=' + values[i];
			if (i < keys.length - 1) {
				strMsg += '&';
			}
		}
		xmlhttp.send(strMsg);
	}
}

function float2int(value) {
	return value | 0;
}

function getValuesFromArray(array) {
	var values = [];
	Object.keys(array).forEach(function(key) {
		values.push(array[key]);
	});
	return values;
}

function removeFromArray(array, elm, compFunc) {
	// if (storage != undefined) {
	// 	for (var i = 0; i < gVoxels.length; i++) {
	// 		if (storage[i][0] == voxel.index[0] && storage[i][1] == voxel.index[1] && storage[i][2] == voxel.index[2]) {
	// 			storage = storage.splice(i, 1);
	// 		}
	// 	}
	// }

	var toRemove = [];
	for (var i = array.length - 1; i >= 0; i--) {
		var equal = undefined;
		if (compFunc != undefined) {
			equal = compFunc(elm, array[i]);
		} else {
			equal = elm == array[i];
		}

		if (equal) {
			toRemove.push(i);
		}
	}

	for (var i = toRemove.length - 1; i >= 0; i--) {
		array.splice(toRemove[i], 1);
	}

	return array;
}

// based on: https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(path, callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

function stitch(array, sep) {
	var str = '';
	for (var i = array.length - 1; i >= 0; i--) {
		str = array[i] + (i < array.length - 1 ? sep : '') + str;
	}
	return str;
}

function addAnArrow(v1, dir, len) {
	var flipped = len < 0;

	// NOW: make an arrow
	var rArrow = 1.5;
	var lArrow = len == undefined ? 100 : Math.abs(len);
	var bodyArrow = new xacCylinder(rArrow, lArrow, MATERIALFOCUS).m;

	var rArrowHead = rArrow * 5;
	var headArrow = new xacCylinder([0, rArrowHead], rArrowHead * 2, MATERIALFOCUS).m;
	headArrow.position.add(new THREE.Vector3(0, 1, 0).multiplyScalar(lArrow * 0.5 + rArrowHead));

	var arrow = new THREE.Object3D();
	arrow.add(bodyArrow);
	arrow.add(headArrow);

	rotateObjTo(arrow, dir.clone().normalize().multiplyScalar(flipped == true ? -1 : 1));
	arrow.position.copy(v1.clone().add(dir.clone().normalize().multiplyScalar(lArrow * 0.5 + (flipped == true ? rArrowHead * 2 : 0))));

	scene.add(arrow);
	return arrow;
}