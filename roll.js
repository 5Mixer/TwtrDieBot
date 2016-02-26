// Load the http module to create an http server.

var twitter = require('twitter');
var creds = require("./creds.js");
var client = new twitter(creds);
/*
client.get('search/tweets', {q: '@tossdie'}, function(error, tweets, response){
	console.log(tweets);
	for (tweet in tweets.statuses){
		console.log(tweet.text);
	}
});
*/
client.stream('statuses/filter', {track: '@tossdie'},  function(stream){
	stream.on('data', function(tweet) {
		var fullTweet = tweet.text;
		var poster = "@"+tweet.user.screen_name;

		var input = fullTweet.substring(fullTweet.lastIndexOf("(")+1,fullTweet.lastIndexOf(")"));


		if (fullTweet.indexOf("(") == -1 || fullTweet.indexOf(")") == -1) return;
		var outcome = process(input);

		if (outcome == -1) return;

		var reply = poster +" "+ outcome;


		console.log(reply);
		console.log(input);

		client.post('statuses/update', {status: reply, in_reply_to_status_id: tweet.id }, function(error, tweetPosted, response){console.log(error);});
	});

	stream.on('error', function(error) {
		console.log(error);
	});
});

function process (text){
	var input = text
	var result = 1;
	console.log(input);

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
			if (multiDigitInt > 101){
				response.end("Bad exploiter, bad!");
				return -1;
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
	//console.log(tokenTypes);
	//console.log(tokens);

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
	if (minNumber < 0 || maxNumber > 100 || numDie > 10) return -1;

	result = "";
	for (i = 0; i < numDie; i++) {
		result += unicodify(randomInt(minNumber,maxNumber));
		if (i != numDie-1){
			result += ", ";
		}
	}

	return ("Rolled "+result+"\n");
}

function unicodify (number){
	/*switch (number) {
		case 1:
			return ⚀;
		case 2:
			return ⚁;
		case 3:
			return ⚂;
		case 4:
			return ⚃;
		case 5:
			return ⚄;
		case 6:
			return ⚅;
		default:
			return number;
	}*/
	return number;
}


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

console.log("BEEP BOP!");
