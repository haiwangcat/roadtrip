// yelp api to extract restaurant information


// build authorization key
var auth = {
  consumerKey: "-gM1MDORZmAKdXjTuhBcdQ",
  consumerSecret: "qZfZ3HOpBMBfG16qwWelOfkfulM",
  accessToken: "tWNxBlQ5ceKYHa-djisC1Skp6MtRcUz3",
  accessTokenSecret: "G2PifoJg3WaApjURvTSDv0snEF4",
  serviceProvider: {
    signatureMethod: "HMAC-SHA1"
  }
};

// build parameter in the url request
var terms = 'food';
var latitude = 37.894201;
var longitude = -119.546449;
var accessor = {
  consumerSecret: auth.consumerSecret,
  tokenSecret: auth.accessTokenSecret
};

parameters = [];
parameters.push(['term', terms]);
//parameters.push(['location', near]);
parameters.push(['ll',latitude + "," + longitude]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
var message = {
  'action': 'http://api.yelp.com/v2/search',
  'method': 'GET',
  'parameters': parameters
};
OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
console.log(parameterMap);


$.ajax({
  'url': message.action,
  'data': parameterMap,
  'cache': true,
  'dataType': 'jsonp',
  'jsonpCallback': 'cb',
  'success': function(data, text, XMLHttpRequest) {
    console.log('data',data);
	for (var j = 0; j < data.businesses.length; ++j){
		var current_business_name = data.businesses[j].name;
		var current_business_lat = data.businesses[j].location[0];
		var current_business_lng = data.businesses[j].location[1];
		console.log('food_name',current_business_name);
		
		$('.food-item:last').clone().appendTo('.food-list').find(".food-name-en").html(current_business_name);
		$('.food-item:first').hide();
		}
	}
});
