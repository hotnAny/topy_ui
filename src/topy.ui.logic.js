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

	for (var i = axes.length - 1; i >= 0; i--) {
		//
		// slider behavior
		//
		$('#sldr' + axes[i]).slider({
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
		$('#sldr' + axes[i]).attr('lb', '#layer' + axes[i]);
		$('#sldr' + axes[i]).attr('tb', 'nElm' + axes[i]);

		//
		// text box behavior
		//
		$('#nElm' + axes[i]).on('input', function(e) {
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

			// update voxels
			// updateVoxels(gNumElms)
			updateVoxels(getValuesFromArray(gIdxLayers));

		});
		$('#nElm' + axes[i]).attr('lb', '#layer' + axes[i]);
		$('#nElm' + axes[i]).attr('sldr', '#sldr' + axes[i]);

		// set initial voxel grid dimensions
		$('#nElm' + axes[i]).val(10);
		$('#nElm' + axes[i]).trigger('input');
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
	// dlgBoundLoad.dialog('option', 'position', [1024, 256]);

	btnOk.button();
	btnOk.click(function(e) {
		for (var i = gSelVoxels.length - 1; i >= 0; i--) {
			var voxel = gSelVoxels[i];

			// check if it is specified as a boundary
			for (var j = axes.length - 1; j >= 0; j--) {
				if ($('#cb' + axes[j]).is(':checked')) {
					voxel.setBoundary(axes[j]);
				}
				voxel.mesh.material = matBoundary;
				voxel.mesh.material.needsUpdate = true;
			}

			// check if it is specified as a load point
			for (var j = axes.length - 1; j >= 0; j--) {
				try {
					var load = parseFloat($('#load' + axes[j]).val());
					if (isNaN(load) == false) {
						voxel.setLoad(axes[j], load);
						voxel.mesh.material = matLoad;
						voxel.mesh.material.needsUpdate = true;
					}
				} catch (e) {

				}
			}
		}

		dlgBoundLoad.dialog('close');
	});

	//
	// textarea for the tpd file editing
	//
	taScript.on('input', function(e) {
		log('script updated')
	});

	btnRun.button();
	btnRun.click(function(e) {
		// callTopy();
		dlgBoundLoad.dialog('open');
	});
}

//
//	generate the tpd file from an object contiaining the info.
//	@param tpd - a javascript objec that contains information of the tpd variables
//
function updateTpdText(tpd) {
	var strTpd = "[ToPy Problem Definition File v2007]\n";

	for (var param in tpd) {
		strTpd += param + ": " + tpd[param] + "\n";
	}

	taScript.html(strTpd);
}


// function updateTpd(tpd, param, value) {
// 	tpd[param] = value;
// }

// function updateTpdText() {
// 	// body...
// }

//
// update UI for editing tpd based on an underlying text file (string)
//
function updateTpdUI(strTpd) {
	var uiParams = []; // the ui's (assuming textboxes, mostly)
	var params = []; // the paramester each ui correspond to

	for (var i = uiParams.length - 1; i >= 0; i--) {
		// find the correpsonding value of params[i] from strTpd

		// update the val of uiParams[i] accordingly
	}
}

//
//	sync tpd object and the editable version on the UI
//
function syncTpd(tpdObj, tpdText) {

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
	});
});