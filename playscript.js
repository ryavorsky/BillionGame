var tim;
var i=0;
var current_time;

var step = 0;
var correct_steps = 0;

var options = [10,20,30,40];
var n_options;
var correct_option = 0;
var worst = 1;

var current_amount = 0.0;
var total_correct = 0.0;
var total_wrong = 0.0;

function go() {
	document.getElementById('config').style.display ="none";
	document.getElementById('playfield').style.display ="";
	current_time = new Date().getTime();
	tim = window.setInterval(action, 100);
	
	data = shuffle(data);
	create_options();
	setTimeout(function() {clearInterval(tim);}, 300250);
}

function action() {
	document.getElementById('z').innerHTML 
		= (parseInt(((new Date().getTime()-current_time)%1000)/100)).toString();
	document.getElementById('y').innerHTML 
		= (parseInt((new Date().getTime()-current_time)/10000)%6).toString();
	document.getElementById('q').innerHTML 
		= (parseInt(((new Date().getTime()-current_time)/1000)%10)).toString();
	document.getElementById('x').innerHTML 
		= (parseInt((new Date().getTime()-current_time)/60000)).toString();
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
		r.addEventListener("mousemove", MouseOver, false);
		r.addEventListener("mouseout", MouseOut, false);
		r.setAttribute("style", "fill:white; stroke:#999; stroke-width:3");
		r.setAttribute("rx", "10");
		r.setAttribute("ry", "10");
		r.setAttribute("x", String(i*size+27));
		r.setAttribute("y", "88");
		r.setAttribute("width", String(size-10));
		r.setAttribute("height", "50");
		svg_field.appendChild(r);

		var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
		t.setAttribute("id", "option_text_"+String(i));
		t.setAttribute("style", "fill:green; stroke:#777; stroke-width:1.0");
		t.setAttribute("class", "option");
		t.setAttribute("text-anchor", "middle");
		t.setAttribute("alignment-baseline", "middle");
		t.setAttribute("font-size", "18");
		t.setAttribute("x", String(i*size + 17 + size/2));
		t.setAttribute("y", "118");
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
	ClearAdvise();
	id = e.currentTarget.id[7];
	v = options[id];
	if (id==correct_option) {
		correct_steps++;
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
		current_amount = parseFloat(data[step][5].replace(",","."));
		correct_option = Math.floor(1.0 * n_options * Math.random());
		worst = (correct_option+1) % 3;
		
		// fill the contract price options
		for (i=0; i< n_options; i++){
			if (i==correct_option){ 
				amount = Math.round(current_amount*10.0)/10.0;
			} else {
				amount = Math.round(Math.random()*1000)/10.0;
			};
			t_elem = document.getElementById("option_text_"+String(i));
			t_elem.textContent = String(amount) + " млрд";
		}
		
		// reference to the contract details
		t_elem = document.getElementById("t_descr0");
		
		t_elem.innerHTML = '<a xlink:href="http://clearspending.ru/contract/'+data[step][0]+'/"> № ' + String(data[step][0]) + "</a>";
		//fill the contract data
		for (j=1; j<5; j++){
			if (j<3){
				elem_id = "t_descr"+String(j);
				t_elem = document.getElementById(elem_id);
				t_elem.textContent = data[step][j];
			} else {
				var details = WrapText(data[step][j]);
				for(var k=0; k<details.length; k++){
					elem_id = "t_descr"+String(j)+String(k);
					//alert(elem_id);
					t_elem = document.getElementById(elem_id);
					t_elem.textContent = details[k];				
				};
			};
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

function ClearAdvise(){
	for (var i=0; i<n_options; i++){
		elem_id = "option_"+String(i);
		elem = document.getElementById(elem_id);
		elem.setAttribute("style", "fill:white; stroke:#999; stroke-width:3");
	};
}

function finalize(){
	document.getElementById('playfield').style.display ="none";
	document.getElementById('results').style.display ="";
	final_time = (parseInt((new Date().getTime()-current_time)/60000)).toString() + " мин " 
		+ (parseInt((new Date().getTime()-current_time)/10000)%6).toString()
		+ (parseInt(((new Date().getTime()-current_time)/1000)%10)).toString() + " сек";
	final_step = step;
	final_correct = correct_steps;
	final_amount = Math.round(total_correct*10.0)/10.0;
	document.getElementById('res_time').innerHTML = final_time;
	document.getElementById('res_steps').innerHTML = final_step;
	document.getElementById('res_correct').innerHTML = final_correct;
	document.getElementById('res_correct_amount').innerHTML = String(final_amount) + " млрд ";
}

function WrapText(input_line){

    var MAXIMUM_CHARS_PER_LINE = 48;

    var words = input_line.split(" ");
    var cur_line = "";
	var res = [];
	//alert (words);
    for (var num = 0; num < words.length; num++) {
        var testLine = cur_line + words[num] + " ";
		if(num == words.length - 1) {
			if (testLine.length > MAXIMUM_CHARS_PER_LINE){
				res.push(cur_line); res.push(words[num]);
			} else {
				res.push(testLine);
			};
		} else {
			if (testLine.length > MAXIMUM_CHARS_PER_LINE) {
				res.push(cur_line);
				cur_line = "";
			} else {
				cur_line = testLine;
			};
		};
    };
	
	while(res.length < 3){res.push('');};
	while(res.length > 3){res.pop();};
	
	return res;
	
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}