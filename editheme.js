//
// CMSUno
// Plugin EdiTheme
//
function f_load_editheme(){
	jQuery(document).ready(function(){
		var p='uno/plugins/editheme/codemirror/',a;
		jQuery.getScript('uno/plugins/editheme/codemirror/codemirror.js',function(){
			a=[p+'php.js',
				p+'clike.js',
				p+'xml.js',
				p+'javascript.js',
				p+'css.js',
				p+'htmlmixed.js',
				p+'matchbrackets.js',
				p+'active-line.js'];
			a.forEach(function(t){jQuery.getScript(t);});
		});
	});
}
function f_init_editheme(){
	document.getElementById('code').style.display='inline';
	var e=CodeMirror.fromTextArea(document.getElementById('code'),{
		lineNumbers:true,
		theme:'base16-dark',
		indentUnit:4,
		indentWithTabs:true,
		styleActiveLine:true,
		matchBrackets:true
	});
	jQuery('#code').data('CodeMirrorInstance',e);
	return e;
}
function f_sel_editheme(f){
	var a=f.options[f.selectedIndex].value,b,c,d,e={'css':'css','html':'htmlmixed','js':'javascript','php':'application/x-httpd-php'};
	b=a.split('.');if(b.length<2)return;
	c=b[b.length-1].toLowerCase();
	document.getElementById('edithemeFile').value=a;
	jQuery.post('uno/plugins/editheme/editheme.php',{'action':'getFile','unox':Unox,'file':a},function(r){
		var d=jQuery('#code').data('CodeMirrorInstance');
		if(typeof d=='undefined')d=f_init_editheme()
		d.doc.setValue(r);
		d.setOption('mode',e[c]);
		d.setSize('100%','600px');
		document.getElementById('edithemeBtn').style.display='block';
	});
}
function f_save_editheme(){
	var d=jQuery('#code').data('CodeMirrorInstance'),c;
	c=d.doc.getValue();
	jQuery.post('uno/plugins/editheme/editheme.php',{'action':'save','unox':Unox,'file':document.getElementById('edithemeFile').value,'cont':c},function(r){f_alert(r);f_plugin('1editheme');});
}
function f_restore_editheme(){
	jQuery.post('uno/plugins/editheme/editheme.php',{'action':'restore','unox':Unox,'file':document.getElementById('edithemeFile').value},function(r){f_alert(r);f_plugin('1editheme');});
}
f_load_editheme();
