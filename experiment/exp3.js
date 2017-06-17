var data = {}; 
data.trials = [];
data.catch_trials = [];
data.system = {
      
    };
var stimuli = {};
//NB: use of async: false is deprecated (but usable)
$.ajax({
	url: 'stimuliexp3.json',
	async: false,
	dataType: 'json',
	success: function (jsondat) {
		var allstimuli = jsondat;
		var allconditions = Object.keys(allstimuli);
		var condition = choice(allconditions);
		stimuli = allstimuli[condition];
		data.condition = condition;
		console.log('success');
	},
	error: function(){
		console.log('error')
	}
});

function asciify(text) {
	console.log("asciify: " + text);

	var str1 = text.replace(/é/g, "e");
	str1 = str1.replace(/á/g, "a");
	str1 = str1.replace(/ó/g, "o");
	str1 = str1.replace(/ú/g, "u");
	str1 = str1.replace(/í/g, "i");
	str1 = str1.replace(/¡/g, "!");
	str1 = str1.replace(/¿/g, "?");
	str1 = str1.replace(/ñ/g, "n");
	str1 = str1.replace(/Á/g, "A");
	str1 = str1.replace(/É/g, "E");
	str1 = str1.replace(/Ó/g, "O");
	str1 = str1.replace(/Ú/g, "U");
	str1 = str1.replace(/Í/g, "I");
	console.log("asciify result: " + str1);

	return str1;
}

/*var allstimuli = {}

var allconditions = Object.keys(allstimuli);
var condition = choice(allconditions);
stimuli = allstimuli[condition];
data.condition = condition;*/

var trialkeys = Object.keys(stimuli[0]);
trialkeys.splice(trialkeys.indexOf('question'),1);

var trainingStim = [
					{
					 stimulus: "El violinista es aplicado y el chelista es aplicado tambi&eacute;n.",
					 question: "",
					 answers: ["S&Iacute, la frase suena bien;", "NO, la frase no suena bien"]
					},   
					{
					 stimulus: "Los donantes es generoso y el fil&aacute;ntropo es generoso tambi&eacute;n.",
					 question: "",
					 answers: ["NO, la frase no suena bien", "S&Iacute, la frase suena bien"]
					},
					{
					 stimulus: "El viejo es taciturno y el joven tambi&eacute;n.",
					 question: "",
					 answers: ["S&Iacute, la frase suena bien", "NO, la frase no suena bien"]
					},
					{
					 stimulus: "La enfermera es atenta y las directoras es atenta tambi&eacute;n.",
					 question: "",
					 answers: ["NO, la frase no suena bien", "S&Iacute, la frase suena bien"]
					}
				   ];

var stimuliPerQuestion = 1;

var questionasked = [];
var qsToAsk = Math.ceil(stimuli.length / stimuliPerQuestion);
var qcounter = 0;
for (var i = 0; i < stimuli.length; i++) {
	if (Math.random() < (qsToAsk - qcounter) / (stimuli.length - i)) {
		questionasked[i] = true;
		qcounter++;
	} else {
		questionasked[i] = false;
	};
};

var indices = shuffle(range(stimuli.length));

var NSlides = stimuli.length; // number of stimuli

var currSlide = 0;
					 
var trialnum = 0;

var isi = 1200; //pause between trials in ms

var firstspace = true;

$(document).keyup(function(e) {
	if (e.keyCode == 0 || e.keyCode == 32) {
		e.preventDefault();
		firstspace = true;
	} else if (e.keyCode == 80 || e.keyCode == 81) {
		e.preventDefault();
	};
});

// ---------------------------------------

$(document).ready(function() {
	showSlide('intro');

	if (turk.previewMode) {
		$("#mustaccept").show();
		$('#gotoInstructions').hide();
	};

    $('#gotoInstructions').click(function() {
        showSlide('instructions');
    });
    $('#trainbutton').click(function() {
		$('.NSlides').html(trainingStim.length);
		$('.progress').show();
        stepTraining();
    });	
    $('#startbutton').click(function() {
		$('.NSlides').html(NSlides);
		currSlide = 0;
        stepExperiment();
    });
	
	
	$('#endbutton').click(function() {
		var lang = asciify($('#langBox').val());
		var resid = asciify($('#residBox').val());
		var cob = asciify($('#cobBox').val());
		var cobParents = asciify($('#cobParentsBox').val());
		var lang05Response = ($('#lang05Form').serialize());
		var langPrefResponse = ($('#langPrefForm').serialize());
		var instrResponse = ($('#instrForm').serialize());
		var age = asciify($('#ageBox').val());
		var gender = asciify($('#genderMenu').val());
		var educ = asciify($('#educMenu').val());
		var handResponse = ($('#handForm').serialize());
		var valid = true;

		if (lang == '' || lang == null) { $('#langError').show(); valid = false; }
			else{$('#langError').hide();}

		if (resid == '' || resid == null) { $('#residError').show(); valid = false; }
			else{$('#residError').hide();}

		if (cob == ''|| cob == null) { $('#cobError').show(); valid = false; }
			else{$('#cobError').hide();}

		if (cobParents == ''|| cobParents == null) { $('#cobParentsError').show(); valid = false;}
			else{$('#cobParentsError').hide();}

		if (lang05Response.length == 0) { $('#lang05ResponseError').show(); valid = false;}
			else{$('#lang05ResponseError').hide();} 

		if (langPrefResponse.length == 0) { $('#langPrefResponseError').show(); valid = false;}
			else{$('#langPrefResponseError').hide();} 

		if (instrResponse.length == 0) { $('#instrResponseError').show(); valid = false;}
			else{$('#instrResponseError').hide();} 

		// if (gender == 'none'|| gender == null) { $('#genderError').show(); valid = false;}
		// 	else{$('#genderError').hide();}

		// if (age == ''|| age == null) { $('#ageError').show(); valid = false;}
		// 	else{$('#ageError').hide();}

		// if (educ == 'none'|| educ == null) { $('#educError').show(); valid = false;}
		// 	else{$('#educError').hide();} 

		if (handResponse.length == 0) { $('#handError').show(); valid = false;}
			else{$('#handError').hide();}


		if (valid == true) {
			data.subject_information = {
				language: lang.replace(",", ";"),
				residence: resid.replace(",", ";"),
				country: cob.replace(",", ";"),
				countryParents: cobParents.replace(",", ";"),
				lang05: lang05Response.split('=')[1],
				langPref: langPrefResponse.split('=')[1],
				instr: instrResponse.split('=')[1],
				handedness: handResponse.split('=')[1],
				age: age.replace(",", ";" ),
				// data.gender = gender.split('=')[1]; // CHECK!!!! Sale [undefined]
				gender: gender, //CHECK IF THIS WORKS
				education: educ, //CHECK IF THIS WORKS
				// data.education = educ.split('=')[1]; // CHECK!!!! Sale [undefined]
				comments: $('#commentsText').val().replace(",", ";")
			}
			showSlide('finish');
			setTimeout(function() { turk.submit(data) }, 1000);
			}
		
	});
});

// ------------------------------------------




function showSlide (slideName) {
	window.scrollTo(0, 0); //scroll to top in case the window has moved
    $('.slide').hide();
    $('#' + slideName).show();
}

function pause (onSlide, resumeFunc, ms) {
	$('.slide').hide();
	if (onSlide != 'none') {
		$('#' + onSlide).show();
	};
	setTimeout(resumeFunc, ms);
}

function parse (str) {
	//parses a string into words with separate span tags
	var words = str.split(" ");
	var newstr = "";
	for (var i = 0; i < words.length; i++) {
		newstr = newstr + '<span class="word" id="word' + i + '" unselectable="on">' + words[i] + '</span>';
		if (i < (words.length - 1)) {
			newstr = newstr + '&nbsp;&nbsp;&nbsp;';
		};
	};
	var obj = {
		Nwords: words.length,
		parsed: newstr
	};
	return obj;
}

function updateProgress () {
	currSlide++;
    $('.currSlide').html(currSlide);
}

function stepTraining() {
	if (trainingStim.length == 0) {
		showSlide('endTraining');
	} else {
		var stimulus = trainingStim.shift();
		var words = parse(stimulus.stimulus);
		$('#currentStim').html(words.parsed);
		updateProgress();
        showSlide('stage'); 
		var currWord = -1;
		$(document).keydown(function(e) {
			if (e.keyCode == 0 || e.keyCode == 32) {
				e.preventDefault();
				if (firstspace) {
					firstspace = false;
					if (currWord == (words.Nwords - 1)) {
						currWord = -1;
						$(document).unbind('keydown');
						var correct = stimulus.answers[0];
						var answers = shuffle(stimulus.answers);
						$('#currentQuest').html(stimulus.question);
						for (var i = 0; i < answers.length; i++) {
							$("#opt" + i).html(answers[i]);
						};
						showSlide('question');
						$(document).keydown(function(e) {
							if (e.keyCode == 80 || e.keyCode == 81) {
								e.preventDefault();
								var response = answers[81 - e.keyCode];
								$(document).unbind('keydown');
								if (response == correct) {
									pause('correct', stepTraining, isi);
								} else {
									pause('incorrect', stepTraining, isi);
								};
							} else if (e.keyCode == 0 || e.keyCode == 32) {
								e.preventDefault();
							};
						});
					} else {
						currWord ++;
						activateWord(currWord);
					};
				};
			} else if (e.keyCode == 80 || e.keyCode == 81) {
				e.preventDefault();
			};
		});
	};
};

function stepExperiment () {
    if (indices.length == 0) {
		showSlide('langInfo');
    } else { 
		var stimIndex = indices.shift();
        trialnum++;
		updateProgress();
		var stimulus = stimuli[stimIndex];
        var trialdata = {
			trialnum: trialnum, 
			question: "NA",
			response: "NA",
			correct: "NA",
			questionRT: "NA",
			target: "NA",
			word0RT: "NA",
			word1RT: "NA",
			word2RT: "NA",
			word3RT: "NA",
			word4RT: "NA",
			word5RT: "NA",
			word6RT: "NA", 
			word7RT: "NA",
			word8RT: "NA",
			word9RT: "NA",
			word10RT: "NA",
			word11RT: "NA",
			word12RT: "NA",
			word13RT: "NA",
			word14RT: "NA"
		};
		for (i=0; i < trialkeys.length; i++) {
			trialdata[trialkeys[i]] = stimulus[trialkeys[i]];
		};
		var criticalID = "word" + trialdata.stimulus.split(" ").indexOf(trialdata.criticalword);
		var postcriticalID = "word" + (trialdata.stimulus.split(" ").indexOf(trialdata.criticalword) + 1);
		var post2criticalID = "word" + (trialdata.stimulus.split(" ").indexOf(trialdata.criticalword) + 2);
		var post3criticalID = "word" + (trialdata.stimulus.split(" ").indexOf(trialdata.criticalword) + 3);
		var words = parse(trialdata.stimulus);
		$('#currentStim').html(words.parsed);
        showSlide('stage'); 
		var currWord = -1;
		var startTime = performance.now();//(new Date()).getTime();
		var endTime = performance.now();//(new Date()).getTime();
		$(document).keydown(function(e) {
			if (e.keyCode == 0 || e.keyCode == 32) {
				e.preventDefault();
				if (firstspace) {
					firstspace = false;
					if (currWord == (words.Nwords - 1)) {
						endTime = performance.now();//(new Date()).getTime();
						trialdata["word" + currWord + "RT"] = endTime - startTime;
						currWord = -1;
						$(document).unbind('keydown');
						trialdata.criticalRT = trialdata[criticalID + "RT"];
						trialdata.postcriticalRT = trialdata[postcriticalID + "RT"];
						trialdata.post2criticalRT = trialdata[post2criticalID + "RT"];
						trialdata.post3criticalRT = trialdata[post3criticalID + "RT"];
						trialdata["criticalword"] = asciify(trialdata["criticalword"]);
						trialdata["stimulus"] = asciify(trialdata["stimulus"]);
						data.trials.push(trialdata);
						if (questionasked[stimIndex]) {
							askQuestion(stimIndex, trialdata);
						} else {
							pause('none', stepExperiment, 500);
						};
					} else {
						if (currWord != -1) {
							endTime = performance.now();//(new Date()).getTime();
							trialdata["word" + currWord + "RT"] = endTime - startTime;
						};
						currWord ++;
						activateWord(currWord);
						startTime = performance.now();//(new Date()).getTime();
					};
				};
			} else if (e.keyCode == 80 || e.keyCode == 81) {
				e.preventDefault();
			};
		});
    }
}

function askQuestion(stimIndex, trialdata) {
	question = stimuli[stimIndex].question;
	trialdata.question = question.question;
	trialdata.target = question.target;
	var correct = question.answers[0];
	var answers = shuffle(question.answers);
	$('#currentQuest').html(trialdata.question);
	for (var i = 0; i < answers.length; i++) {
		$("#opt" + i).html(answers[i]);
	};
	showSlide('question');
	var startTime = performance.now();//(new Date()).getTime();
	$(document).keydown(function(e) {
		if (e.keyCode == 80 || e.keyCode == 81) {
			e.preventDefault();
			//P (RHS) is 80, Q (LHS) is 81
			var endTime = performance.now();//(new Date()).getTime();
			trialdata.questionRT = endTime - startTime;
			if (e.keyCode == 80) {
				trialdata.hand = 'left';
			} else {
				trialdata.hand = 'right';
			};
			var response = answers[81 - e.keyCode];
			trialdata.response = asciify(response);
			if (response == correct) {
				trialdata.correct = 1;
			} else {
				trialdata.correct = 0;
			}
			$(document).unbind('keydown');
			if (trialdata.correct == 1) {
				pause('none', stepExperiment, 500);
			} else {
				pause('none', stepExperiment, 500);
			};
		} else if (e.keyCode == 0 || e.keyCode == 32) {
			e.preventDefault();
		};
	});
};

function activateWord (i) {
	$('.activeword').attr('class', 'word');
	$('#word' + i).attr('class', 'activeword');
};

function range(n) {
	var arr = [];
	for(var i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
};

function choice(arr) {
	//select an item from an array.
	return arr[Math.floor(Math.random() * arr.length)];
};

function shuffle(v) { // non-destructive.
    var newarray = v.slice(0);
    for (var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);
    return newarray;
};
