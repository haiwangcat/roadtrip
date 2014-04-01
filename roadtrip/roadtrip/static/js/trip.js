// Django CSRF framework
$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

// begin 
var tripPanelOn = false;

var directionWaypoints = new Array ();
var waypoint = {
	location: '',
	stopover: true
};

var showDirectionSwitch;
var selectedItemList = new Array();

$(".add-to-trip").click(function(){
  var selectedPOI = $(".poi-button.selected");
  if (selectedPOI.length == 0)
    return;
  var poiID = selectedPOI.find("> .poi-id").html();
  var data = {
    //csrfmiddlewaretoken: '{{csrf_token}}'
    poi_id: poiID,
  };
  console.log(poiID);
  $.post('/add-to-trip/', data, function(response, status) {
    console.log('response:' + response + '\n' + 'status:' + status);
  });
});


$("#show-itinerary").click(function(){
  var itemCount = selectedItemList.length;
  console.log(itemCount);
  console.log(selectedItemList[0]);
  var list_name = new Array();
  var list_latlng = new Array();
  for (var i = 0; i <= itemCount-1; i++){
    list_name.push(selectedItemList[i].name);
    list_latlng.push("(" + selectedItemList[i].lat + "," + selectedItemList[i].lng + ")");
  }
  var name = list_name.toString();
  var latlng = list_latlng.toString();
  console.log(name);
  console.log(latlng);
  
  var tripName = 'mingchang';
  turnOnTripPanel(tripName);
});

function initTripPanelEventListeners() {
  $(".close-info-panel").click(function() {
    turnOffTripPanel();
  });
}

function turnOnTripPanel(tripName) {
  var mapCanvas = $("#map-canvas");
  var width = parseInt(mapCanvas.css("width"));
  var left = (width - parseInt($("#overlay-panel").css("width"))) / 2 + parseInt(mapCanvas.css("left"));
  $("#overlay-panel").css("left", left);
  $("#overlay-content").load('/get-trip/?trip=' + tripName + '&trip_id=0', function() {
    $("#overlay-panel").show();
    initTripPanelEventListeners();
    tripPanelOn = true;
  });
}

function turnOffTripPanel() {
  $("#overlay-panel").hide();
    tripPanelOn = false;
}


$('#show-direction').click(function(){
//	console.log('switch',showDirectionSwitch);
	var list = {};
	list = selectedItemList;
	if( showDirectionSwitch == 0 || showDirectionSwitch == undefined){
		showDirectionSwitch = 1;
		var itemCount = list.length;
		var lat_start = list[0].lat;
		var lat_end = list[itemCount - 1].lat;
		var lng_start = list[0].lng;
		var lng_end = list[itemCount - 1].lng;

  		var start = new google.maps.LatLng(lat_start, lng_start);
  		var end = new google.maps.LatLng(lat_end, lng_end);
 
  		for (var i = 1; i <= itemCount - 2; i++){
  			var currentLat = list[i].lat;
  			var currentLng = list[i].lng;
 
  			var waypoint = {};
  			waypoint.location = new google.maps.LatLng(currentLat, currentLng);
  			waypoint.stopover = true;
  			console.log('waypoint',waypoint);
  			directionWaypoints.push(waypoint);
  		}
  		
  		var request = {
    		origin:start,
    		destination:end,
  			waypoints: directionWaypoints,
    		travelMode: google.maps.TravelMode.DRIVING,
    		optimizeWaypoints: true
  		};
   
  		directionsService.route(request, function(response, status) {
    		if (status == google.maps.DirectionsStatus.OK) {
    			var	directionsDisplay = {};
    	  		directionsDisplay = new google.maps.DirectionsRenderer({
    				suppressMarkers: false,
    				preserveViewport: true
  				});

  				directionsDisplay.setMap(map);
				directionsDisplay.setDirections(response);
			}
  		});
	}
	else{
		showDirectionSwitch = 0;
		var directionsDisplay= {};
		directionsDisplay = new google.maps.DirectionsRenderer({
			suppressMarkers: false,
			preserveViewport: true
		});
		directionsDisplay.setMap(null);
	}
//	console.log(showDirectionSwitch);
});

function calcDistance(route){
	var distanceTotal = 0;
	for (var i = 0; i < route.legs.length; i++){
		distanceTotal += route.legs[i].distance.value;
	}
	return  distanceTotal;
}
