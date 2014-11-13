var tim;
var i=0;
var current_time;

var step = 0;

var options = [10,20,30,40];
var n_options;
var correct_option = 0;
var worst = 1;

var current_amount = 0;
var total_correct = 0;
var total_wrong = 0;

function go() {
	current_time = new Date().getTime();
	document.getElementById('config').style.display ="none";
	document.getElementById('playfield').style.display ="";
	create_options();
	tim = window.setInterval(action, 1000);
	setTimeout(function() {clearInterval(tim);}, 301000);
}

function action() {
	document.getElementById('x').innerHTML = (parseInt((new Date().getTime()-current_time)/1000)).toString();
		}

function create_options(){
	n_options = number_of_options();
	var size = 750 / n_options;
	svg_field = document.getElementById('svg_field');

	for(i=0; i<n_options; i++)
	{
		var r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		r.setAttribute("id", "option_"+String(i));
		r.onclick = Selected;
		r.addEventListener("mouseover", MouseOver, false);
		r.addEventListener("mouseout", MouseOut, false);
		r.setAttribute("style", "fill:white; stroke:#999; stroke-width:3");
		r.setAttribute("rx", "10");
		r.setAttribute("ry", "10");
		r.setAttribute("x", String(i*size+27));
		r.setAttribute("y", "17");
		r.setAttribute("width", String(size-10));
		r.setAttribute("height", "50");
		svg_field.appendChild(r);

		var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
		t.setAttribute("id", "option_text_"+String(i));
		t.setAttribute("style", "fill:cyan; stroke:#777; stroke-width:0.5");
		t.setAttribute("class", "option");
		t.setAttribute("text-anchor", "middle");
		t.setAttribute("alignment-baseline", "middle");
		t.setAttribute("font-size", "18");
		t.setAttribute("x", String(i*size + 17 + size/2));
		t.setAttribute("y", "44");
		svg_field.appendChild(t);
	};	

	update_options();
}

function number_of_options(){
	res = 3;
	if(document.getElementById('level_1').checked) {res = 2};
	if(document.getElementById('level_2').checked ) {res = 3};
	if(document.getElementById('level_3').checked ) {res = 4};
	return res;
}

function Selected(e){
	id = e.currentTarget.id[7];
	v = options[id];
	if (id==correct_option) {
		total_correct = total_correct + current_amount;
		document.getElementById("t_correct").textContent = Math.round(total_correct*10.0)/10.0;
	} else {
		total_wrong = total_wrong + current_amount;
		document.getElementById("t_wrong").textContent = Math.round(total_wrong*10.0)/10.0;
	};
	update_options();
}

function update_options(){
	if (step == data.length){ 
		finalize() 
	} else {
	
		// compute the amount options
		current_amount = data[step][4];
		correct_option = Math.floor(1.0 * n_options * Math.random());
		worst = (correct_option+1) % 3;
		for (i=0; i< n_options; i++){
			if (i==correct_option){ 
				amount = current_amount;
			} else {
				amount = Math.round(Math.random()*1000)/10.0;
			};
			t_elem = document.getElementById("option_text_"+String(i));
			t_elem.textContent = String(amount) + " mlrd";
		}
		
		//fill the contract data
		for (j=0; j<4; j++){
			t_elem = document.getElementById("t_descr"+String(j));
			t_elem.textContent = data[step][j];
		};
		step++;
	}
}

function MouseOver(e){
	id = e.currentTarget.id[7];
	if (id==worst) {
	e.currentTarget.setAttribute("style", "fill:red; stroke:#999; stroke-width:3");
	} else {
	e.currentTarget.setAttribute("style", "fill:yellow; stroke:#999; stroke-width:3");
	}
}

function MouseOut(e){
	e.currentTarget.setAttribute("style", "fill:white; stroke:#999; stroke-width:3");
}

function finalize(){
	alert ('Done!');
};