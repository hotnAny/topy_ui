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
		$('#nElm' + axes[i]).trigger('input')

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
				log(voxel)

				// check if it is a boundary
				// voxel.isBoundary = false;
				for (var j = axes.length - 1; j >= 0; j--) {
					if ($('#cb' + axes[j]).is(':checked')) {
						// voxel.isBoundary = true;
						// if (voxel.fxtr == undefined) {
						// 	voxel.fxtr = [];
						// }
						// voxel.fxtr[axes[j]] = voxel.index;
						voxel.setBoundary(axes[j]);
					}
				}
				log(voxel.fxtr);

				// check if it is a load point
				// voxel.isLoad = false;
				for (var j = axes.length - 1; j >= 0; j--) {
					try {
						var load = parseFloat($('#load' + axes[j]).val());
						if (isNaN(load) == false) {
							// voxel.isLoad = true;
							// if (voxel.load == undefined) {
							// 	voxel.load = [];
							// }
							// voxel.load[axes[j]] = load;
							voxel.setLoad(axes[j], load)
						}
					} catch (e) {

					}
				}
				log(voxel.loads);
			}

			dlgBoundLoad.dialog('close');
		});
	}

	btnRun.button();
	btnRun.click(function(e) {
		// callTopy();
		dlgBoundLoad.dialog('open');
	});
}

$(document).ready(function() {
	initPanel();
});