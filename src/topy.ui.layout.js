/*------------------------------------------------------------------------------------*
 *
 * ui layout (widgets and controls), based on jquery
 * 
 * by xiang 'anthony' chen, xiangchen@acm.org
 *
 *------------------------------------------------------------------------------------*/

var panel = $('<div></div>');
panel.css('width', WIDTHPANEL + 'px');
panel.css('height', '100%');
panel.css('color', '#000000');
panel.css('background-color', 'rgba(192, 192, 192, 0.5)');
panel.css('top', '0px');
panel.css('position', 'absolute');
panel.css('font-family', 'Helvetica');
panel.css('font-size', '12px');
panel.css('overflow', 'auto');

var title = $('<h3>Topy</h3>');
title.html('Topy');
title.css('margin-top', '10px');
title.css('margin-bottom', '10px');
title.css('margin-left', '10px');
title.css('margin-right', '10px');
panel.append(title);


//
// problem name input
//
var tblInfo = $('<table class="ui-widget"></table>');
tblInfo.css('margin', '5px');
var trName = $('<tr></tr>');
trName.append($('<td style="padding: 5px">Problem name: </td>'));
trName.append($('<td style="padding: 5px"><input type="text" id="probName" size="24"></td>'));
tblInfo.append(trName);

panel.append(tblInfo);


//
// TODO: convergence conditions
//


//
//
// specify elements, boundary and load
//
//
var tblAxes = $('<table class="ui-widget"></table>');
tblAxes.css('margin', '5px');
var axes = ['Z', 'Y', 'X'];
for (var i = axes.length - 1; i >= 0; i--) {
	var trAxis = $('<tr></tr>');
	trAxis.append($('<td style="padding: 5px">' + axes[i] + '</td>'));
	trAxis.append($('<td style="padding: 5px"><input type="text" id="nElm' + axes[i] + '" size="3"></td>'));
	trAxis.append($('<td width="256px" style="padding: 5px"><div id="sldr' + axes[i] + '"></div></td>'));
	trAxis.append($('<td style="padding: 5px"><label id="layer' + axes[i] + '" ></label></td>'));
	tblAxes.append(trAxis);
}
panel.append(tblAxes);

//
//
//	dialog for specifying boundary and load
//
//
var dlgBoundLoad = $('<div></div>');
dlgBoundLoad.title = 'Boundary and Load';
dlgBoundLoad.append('');

var tblBoundLoad = $('<table class="ui-widget" cellspacing="2" cellpadding="2"></table>');
dlgBoundLoad.append(tblBoundLoad);

var trBound = $('<tr></tr>');
trBound.append($('<td>Boundary: </td>'));
for (var i = axes.length - 1; i >= 0; i--) {
	trBound.append($('<td style="padding: 5px">' + axes[i] + '</td>'));
	trBound.append($('<td style="padding: 5px"><input type="checkbox" id="cb' + axes[i] + '"></td>'));
}
tblBoundLoad.append(trBound);

var trLoad = $('<tr></tr>');
trLoad.append($('<td>Load: </td>'));
for (var i = axes.length - 1; i >= 0; i--) {
	trLoad.append($('<td style="padding: 5px">' + axes[i] + '</td>'));
	trLoad.append($('<td style="padding: 5px"><input type="text" id="load' + axes[i] + '" size="3"></td>'));
}
tblBoundLoad.append(trLoad);

dlgBoundLoad.append($('<br>'));

var btnOk = $('<div style="float: right;">OK</div>');
dlgBoundLoad.append(btnOk);

$(document.body).append(dlgBoundLoad);

//
//	finish-up buttons
//
var tblButtons = $('<table><tr></tr></table>');
tblButtons.css('margin', '10px');

var btnRun = $('<div>Run</div>');
var tdRun = $('<td></td>');
tdRun.append(btnRun);
tblButtons.append(tdRun);

panel.append(tblButtons);


//
//	script view
//
var tblScript = $('<table class="ui-widget"></table>');
tblScript.css('margin', '15px');
// tblScript.append($('<tr><td>tpd file</td></tr>'));
var trScript = $('<tr></tr>');
var taScript = $('<textarea rows="36" cols="52"></textarea>');
trScript.append(taScript);
tblScript.append(trScript);

panel.append(tblScript);


addUIforParam('probName', 'PROB_NAME');
addUIforParam('nElmX' 'NUM_ELEM_X');
addUIforParam('nElmY' 'NUM_ELEM_Y');
addUIforParam('nElmZ' 'NUM_ELEM_Z');

//
// subroutines for adding editable parameters and the corresponding uis
// @param ui - the id (for jquery) of the ui
// @param param - the corresponding tpd parameter
//
function addUIforParam(ui, param) {
	UIOFPRAMS.push(ui);
	PARAMSFORUI.push(param);
}