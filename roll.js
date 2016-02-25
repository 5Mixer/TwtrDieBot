// Load the http module to create an http server.
var http = require('http');

var helpText = "You need to pass in some roll info. Examples... \n\nd -> Roll 1 die, 1-6\n3d -> Roll 3 die, 1-6\n3d9 -> Roll 3 die 1-9\nd3 -> Roll 1 die 1-3\n\nEnd an input with [min-max] to override the minimum and maximum value.";

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	var input = unescape(request.url.substr(1));

	response.writeHead(200, {"Content-Type": "text/plain"});
	if (request.url == "/"){
		response.end(helpText+"\n");
	}else{

		var result = 1;

		var tokenTypes = "";
		var tokens = [];


		for (i = 0; i < input.length; i++) {
			if (isInt(ch(input,i+1))){
				tokenTypes+= "I"; //INT

				var multiDigitInt = ch(input,i+1) + "";
				while ( isInt(ch(input,i+2))){ //While the next char is an int... add it.
					multiDigitInt += ch(input,i+2);
					i++;
				}
				if (multiDigitInt > 99){
					response.end("Bad exploiter, bad!");
					return;
				}
				tokens.push(parseInt(multiDigitInt));

			}else if (ch(input,i+1) == "[" || ch(input,i+1) == "]"){
				// Open range operator.
				tokenTypes += ch(input,i+1);
				tokens.push(ch(input,i+1));
				
			}else{
				tokenTypes+= "L"; //LETTER
				tokens.push(ch(input,i+1));
			}
		}
		console.log(tokenTypes);
		console.log(tokens);

		var minNumber = 1;
		var maxNumber = 6;
		var numDie = 1;

		if ((tokens[0] == "d" || tokens[0] == "D") && tokenTypes=="L" ){
			result = randomInt (minNumber,maxNumber);
		}

		if (stringStartsWith (tokenTypes,"IL")){
			//first is int.
			//Roll several die, 1-6
			numDie = tokens[0];
		}

		if (stringStartsWith (tokenTypes,"LI")){
			maxNumber = tokens[1];
		}
		if (stringStartsWith (tokenTypes,"ILI")){
			//first is int.
			//Roll several die, up to a certain number
			numDie = tokens[0];
			maxNumber = tokens[2];

		}

		if (tokenTypes.indexOf("[") != -1){
			//There is a range
			minNumber = tokens[tokenTypes.indexOf("[")+1];
			maxNumber = tokens[tokenTypes.indexOf("[")+3];
		}

		console.log("Min: "+minNumber+" Max: "+maxNumber+" Num: "+numDie);


		result = "";
		for (i = 0; i < numDie; i++) {
			result += randomInt(minNumber,maxNumber);
			if (i != numDie-1){
				result += ", ";
			}
		}

		response.end("Rolled "+result+"\n");
	}
	
});

function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}

function randomInt (low, high) {
	return Math.floor(Math.random() * ((high+1) - low) + low);
}


function ch(str,place){
	return str.charAt(place-1);
}


function isInt(chara){
	var c =  chara;
	if (c >= '0' && c <= '9') {
	    // it is a number
	    return true;
	} else {
	    // it isn't
	    return false;
	}
}


// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(80);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");