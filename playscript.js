var tim;
var i=0;
var cur;

function go() {
	cur = new Date().getTime();
	document.getElementById('config').style.display ="none";
	document.getElementById('playfield').style.display ="";
	tim = window.setInterval(action, 1000);
	setTimeout(function() {clearInterval(tim);}, 301000);
}

function action() {
	document.getElementById('x').innerHTML = (parseInt((new Date().getTime()-cur)/1000)).toString();
		}
