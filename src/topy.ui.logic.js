/*------------------------------------------------------------------------------------*
 *
 * ui logic (event handlers, etc.), based on jquery
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

$(document.body).append(panel);

var initPanel = function() {
	//
	//	drag 'n' drop object into the scene
	//
	$(document).on('dragover', function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer = e.originalEvent.dataTransfer;
		e.dataTransfer.dropEffect = 'copy';
	});

	$(document).on('drop', function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer = e.originalEvent.dataTransfer;
		var files = e.dataTransfer.files;

		for (var i = files.length - 1; i >= 0; i--) {
			var reader = new FileReader();
			reader.onload = (function(e) {
				loadStl(e.target.result);
			});
			reader.readAsBinaryString(files[i]);
		}
	});

	for (var i = axes.length - 1; i >= 0; i--) {
		$('#sldr' + axes[i]).slider({
			orientation: "horizontal",
			range: "min",
			max: 100,
			value: 100
		});
	}

	btnRun.button();
	btnRun.click(function(e){
		callTopy();
	});
}

initPanel();