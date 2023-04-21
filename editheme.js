//
// CMSUno
// Plugin EdiTheme
//
var CodeMirrorDatas;
function f_load_editheme(){
	let p='uno/plugins/editheme/codemirror/',a,js,e;
	a=[p+'php.js',
		p+'clike.js',
		p+'xml.js',
		p+'javascript.js',
		p+'css.js',
		p+'htmlmixed.js',
		p+'matchbrackets.js',
		p+'active-line.js'];
	e=document.getElementsByClassName("scrcodemirror");
	while(e.length>0)e[0].parentNode.removeChild(e[0]);
	fetch('uno/plugins/editheme/codemirror/codemirror-min.js')
	.then(r=>r.text())
	.then(t=>{
		js=document.createElement("script");
		js.className="srccodemirror";
		js.textContent=t;
		document.head.appendChild(js);
	})
	.then(function(){
		a.forEach(function(v){
			fetch(v)
			.then(r=>r.text())
			.then(t=>{
				js=document.createElement("script");
				js.className="scrcodemirror";
				js.textContent=t;
				document.head.appendChild(js);
			});
		});
	});
}
function f_init_editheme(){
	document.getElementById('code').style.display='inline';
	let e=CodeMirror.fromTextArea(document.getElementById('code'),{
		lineNumbers:true,
		theme:'base16-dark',
		indentUnit:4,
		indentWithTabs:true,
		styleActiveLine:true,
		matchBrackets:true
	});
	CodeMirrorDatas=e;
	return e;
}
function f_sel_editheme(f){
	let a=f.options[f.selectedIndex].value,b,c,d,e={'css':'css','html':'htmlmixed','js':'javascript','php':'application/x-httpd-php'};
	b=a.split('.');if(b.length<2)return;
	c=b[b.length-1].toLowerCase();
	document.getElementById('edithemeFile').value=a;
	let x=new FormData();
	x.set('action','getFile');
	x.set('unox',Unox);
	x.set('utem',Utem);
	x.set('file',a);
	fetch('uno/plugins/editheme/editheme.php',{method:'post',body:x})
	.then(r=>r.text())
	.then(function(r){
		d=CodeMirrorDatas;
		if(typeof d=='undefined')d=f_init_editheme()
		d.doc.setValue(r);
		d.setOption('mode',e[c]);
		d.setSize('100%','600px');
		document.getElementById('edithemeBtn').style.display='block';
	});
}
function f_save_editheme(){
	let d=CodeMirrorDatas,c;
	c=d.doc.getValue();
	let x=new FormData();
	x.set('action','save');
	x.set('unox',Unox);
	x.set('utem',Utem);
	x.set('file',document.getElementById('edithemeFile').value);
	x.set('cont',c);
	fetch('uno/plugins/editheme/editheme.php',{method:'post',body:x})
	.then(r=>r.text())
	.then(function(r){
		f_alert(r);
		f_plugin('1editheme');
	});
}
function f_restore_editheme(){
	let x=new FormData();
	x.set('action','restore');
	x.set('unox',Unox);
	x.set('utem',Utem);
	x.set('file',document.getElementById('edithemeFile').value);
	fetch('uno/plugins/editheme/editheme.php',{method:'post',body:x})
	.then(r=>r.text())
	.then(function(r){
		f_alert(r);
		f_plugin('1editheme');
	});
}
f_load_editheme();
