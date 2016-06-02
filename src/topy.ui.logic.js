/*------------------------------------------------------------------------------------*
 *
 * ui logic (event handlers, etc.), based on jquery
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

$(document.body).append(panel);

var initPanel = function() {

	unitTest();

	//
	//	problem name
	//
	$('#probName').on('input', function(e) {
		var tb = $(e.target);
		if (gTpd != undefined) {
			updateTpd(gTpd, tb.attr('id'), tb.val());
			updateTpdText(gTpd);
		}
	});;

	for (var i = gAxes.length - 1; i >= 0; i--) {
		//
		// slider behavior
		//
		$('#sldr' + gAxes[i]).slider({
			orientation: "horizontal",
			range: "min",
			max: 100,
			value: 100,
			slide: function(e) {
				var sldr = $(e.target);
				var value = sldr.slider('value');
				var minValue = sldr.slider("option", "min");
				var maxValue = sldr.slider("option", "max");
				var nElm = gNumElms[sldr.attr('tb')];
				var layer = float2int(nElm * (value - minValue) / (maxValue - minValue) + 0.5);
				$(sldr.attr('lb')).html(layer);
				return layer;
			},
			change: function(e) {
				var sldr = $(e.target);
				var value = sldr.slider('value');
				var minValue = sldr.slider("option", "min");
				var maxValue = sldr.slider("option", "max");
				var nElm = gNumElms[sldr.attr('tb')];
				var layer = float2int(nElm * (value - minValue) / (maxValue - minValue) + 0.5);
				gIdxLayers[sldr.attr('tb')] = layer;
				updateVoxels(getValuesFromArray(gIdxLayers));
			}
		});
		$('#sldr' + gAxes[i]).attr('lb', '#layer' + gAxes[i]);
		$('#sldr' + gAxes[i]).attr('tb', 'nElm' + gAxes[i]);

		//
		// text box behavior
		//
		$('#nElm' + gAxes[i]).on('input', function(e) {
			var tb = $(e.target);
			var nElm = Math.min(MAXNUMELMS, float2int(tb.val()));

			// store updated value
			tb.val(nElm);

			if (gNumElms[tb.attr('id')] > 1) {
				gIdxLayers[tb.attr('id')] = nElm * gIdxLayers[tb.attr('id')] / gNumElms[tb.attr('id')];
			} else {
				gIdxLayers[tb.attr('id')] = nElm;
			}
			gNumElms[tb.attr('id')] = nElm;

			// update slided layer
			var sldr = $(tb.attr('sldr'));
			var value = sldr.slider('value');
			var minValue = sldr.slider("option", "min");
			var maxValue = sldr.slider("option", "max");
			var layer = float2int(nElm * (value - minValue) / (maxValue - minValue) + 0.5);
			layer = Math.min(MAXNUMELMS, layer);
			$(tb.attr('lb')).html(layer);

			// update text area (script)
			if (gTpd != undefined) {
				updateTpd(gTpd, tb.attr('id'), tb.val());
				updateTpdText(gTpd);
			}

			// update voxels
			updateVoxels(getValuesFromArray(gIdxLayers));

		});
		$('#nElm' + gAxes[i]).attr('lb', '#layer' + gAxes[i]);
		$('#nElm' + gAxes[i]).attr('sldr', '#sldr' + gAxes[i]);

		// set initial voxel grid dimensions
		$('#nElm' + gAxes[i]).val(10);
		$('#nElm' + gAxes[i]).trigger('input');
	}

	//
	// prompt for specifying load/boundary
	//
	dlgBoundLoad.dialog({
		autoOpen: false,
		maxWidth: 280,
		maxHeight: 160,
		width: 280,
		height: 160,
		show: {
			effect: "fade",
			duration: 500
		},
		hide: {
			effect: "fade",
			duration: 500
		},
		position: {
			my: "right middle",
			at: "right-25 top+160",
			of: window
		}
	});

	btnOk.button();
	btnOk.click(function(e) {
		for (var i = gSelVoxels.length - 1; i >= 0; i--) {
			var voxel = gSelVoxels[i];

			// check if it is specified as a boundary
			for (var j = gAxes.length - 1; j >= 0; j--) {
				if ($('#cb' + gAxes[j]).is(':checked')) {
					voxel.setBoundary(gAxes[j]);
					voxel.mesh.material = matBoundary;
					voxel.mesh.material.needsUpdate = true;
					gBoundVoxels.push(voxel);
				}
			}

			// check if it is specified as a load point
			for (var j = gAxes.length - 1; j >= 0; j--) {
				try {
					var load = parseFloat($('#load' + gAxes[j]).val());
					if (isNaN(load) == false) {
						voxel.setLoad(gAxes[j], load);
						voxel.mesh.material = matLoad;
						voxel.mesh.material.needsUpdate = true;
						gLoadVoxels.push(voxel);
					}
				} catch (e) {}
			}

			// if it is none of anything, remove it
			if (!voxel.isBoundary && !voxel.isLoad) {
				setHighlight(voxel.mesh, false);
			}
		}

		updateSpecialVoxels();

		dlgBoundLoad.dialog('close');
	});

	dlgBoundLoad.on('dialogclose', function(e) {
		for (var i = gSelVoxels.length - 1; i >= 0; i--) {
			var voxel = gSelVoxels[i];
			if (!voxel.isBoundary && !voxel.isLoad) {
				setHighlight(voxel.mesh, false);
			}
		}
	});

	//
	// textarea for the tpd file editing
	//
	taScript.on('input', function(e) {
		updateTpdUI(taScript.val());
	});

	btnRun.button();
	btnRun.click(function(e) {
		// callTopy();
		dlgBoundLoad.dialog('open');
	});
}

function updateSpecialVoxels() {

	var fxtrNodes = new Array();
	var loadNodes = new Array();
	var loadValues = new Array();

	for (var i = gAxes.length - 1; i >= 0; i--) {
		fxtrNodes[gAxes[i]] = [];
		loadNodes[gAxes[i]] = [];
		loadValues[gAxes[i]] = [];
	}

	for (var i = gBoundVoxels.length - 1; i >= 0; i--) {
		var voxel = gBoundVoxels[i];
		for (var j = gAxes.length - 1; j >= 0; j--) {
			if (voxel.fxtr[gAxes[j]] == true) {
				var nodes = compactElm2Nodes(voxel.index);
				fxtrNodes[gAxes[j]] = fxtrNodes[gAxes[j]].concat(nodes);
			}
		}
	}

	for (var i = gLoadVoxels.length - 1; i >= 0; i--) {
		var voxel = gLoadVoxels[i];
		for (var j = gAxes.length - 1; j >= 0; j--) {
			if (voxel.loads[gAxes[j]] != undefined) {
				var nodes = compactElm2Nodes(voxel.index);
				loadNodes[gAxes[j]] = loadNodes[gAxes[j]].concat(nodes);
				loadValues[gAxes[j]].push(voxel.loads[gAxes[j]] + '@8');
			}
		}
	}

	// update the tpd object/file
	for (var i = gAxes.length - 1; i >= 0; i--) {
		var nodesFxtr = fxtrNodes[gAxes[i]];
		var paramFxtr = 'FXTR_NODE_' + gAxes[i];
		gTpd[paramFxtr] = stitch(nodesFxtr, ';');

		var nodesLoad = loadNodes[gAxes[i]];
		var paramLoadNode = 'LOAD_NODE_' + gAxes[i];
		gTpd[paramLoadNode] = stitch(nodesLoad, ';');

		var valuesLoad = loadValues[gAxes[i]];
		var paramLoadValue = 'LOAD_VALU_' + gAxes[i];
		gTpd[paramLoadValue] = stitch(valuesLoad, ';');
	}

	updateTpdText(gTpd);

}

//
//	update a tpd object maintaining information for a global tpd config file
//
function updateTpd(tpd, ui, value) {
	for (var i = UIOFPARAMS.length - 1; i >= 0; i--) {
		if (UIOFPARAMS[i].localeCompare(ui) == 0) {
			tpd[PARAMSFORUI[i]] = value;
			break;
		}
	}
}

//
//	generate the tpd file from an object contiaining the info.
//	@param tpd - a javascript objec that contains information of the tpd variables
//
function updateTpdText(tpd) {
	var strTpd = "[ToPy Problem Definition File v2007]\n";

	for (var param in tpd) {
		strTpd += param + ":" + tpd[param] + "\n";
	}

	taScript.val(strTpd);
}


//
// update UI for editing tpd based on an underlying text file (string)
//
function updateTpdUI(strTpd) {
	for (var i = 0; i < UIOFPARAMS.length; i++) {
		// find the correpsonding value of params[i] from strTpd
		var ui = UIOFPARAMS[i];
		var param = PARAMSFORUI[i];
		var idxParam = strTpd.indexOf(param);
		var idxValue0 = strTpd.substring(idxParam).indexOf(':') + 1;
		var idxValue1 = strTpd.substring(idxParam).indexOf('\n');
		// log(idxValue0 + " " + idxValue1)
		var val = strTpd.substring(idxParam).substring(idxValue0, idxValue1);

		// update the val of uiParams[i] accordingly
		$('#' + ui).val(val);
	}
}

//
// thee ready function
//
$(document).ready(function() {
	initPanel();

	// load the tpd template
	loadJSON('res/tpd.json', function(response) {
		gTpd = JSON.parse(response);
		updateTpdText(gTpd);
		updateTpdUI(taScript.val());
	});
});