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

var waypoint = {
	location: '',
	stopover: true
};

var showDirectionSwitch;
var selectedItemList = new Array();

$("#add-to-trip").click(function(){
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

  var list_name = new Array();
  var list_latlng = new Array();
  for (var i = 0; i <= itemCount-1; i++){
    list_name.push(selectedItemList[i].name);
    list_latlng.push("(" + selectedItemList[i].lat + "," + selectedItemList[i].lng + ")");
  }

  var tripName = 'mingchang';
  turnOnTripPanel(tripName);
});

function initTripPanelEventListeners() {
  $(".close-info-panel").click(function() {
    turnOffTripPanel();
  });
  
  var directionWaypoints = new Array ();

  $(".itinerary-waypoint-view").each(function(){
    var currentLat = $(this).find("> .itinerary-waypoint-gps").html().split(",")[0];
	var currentLng = $(this).find("> .itinerary-waypoint-gps").html().split(",")[1];
	
	waypoint = new Object();
	waypoint.location = new google.maps.LatLng(currentLat, currentLng);
	waypoint.stopover = true;
	directionWaypoints.push(waypoint);
  });  
  var start = directionWaypoints[0].location;
  var end = directionWaypoints[directionWaypoints.length-1].location;
  directionWaypoints.splice(0,1);
  directionWaypoints.splice(-1,1);

  $(".itinerary-waypoint-gps").hide();
  
  var request = {
    origin:start,
    destination:end,
  	waypoints: directionWaypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: false
  };
   
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var directionsDisplay = {};
      directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
    	preserveViewport: true
  	  });
  	  //directionsDisplay.setMap(map);
	  //directionsDisplay.setDirections(response);
	  var route = response.routes[0];
	  console.log(route);
	  var tripInfo = calcTripInfo(route);
	  console.log(tripInfo);
	  
	  $(".itinerary-leg-view").each(function(i){
	    if (i >= tripInfo.length){
	      return;
	    }
	    var hour = Math.round(tripInfo.durations[i]/3600);
	    var min = Math.round((tripInfo.durations[i] - hour*3600)/60);
	    var km = Math.round(tripInfo.distances[i]*0.3048/1000 * 10) / 10;
	    $(this).find("> .duration").html(hour + "H" + min + "M");
	    $(this).find("> .distance").html(km + "KM");
	    console.log(i);
	  });	
	}
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

function calcTripInfo(route){
  var distances = new Array();
  var distanceTotal = 0;

  var durations = new Array();
  var durationTotal = 0;
  
  for (var i = 0; i < route.legs.length; i++){
    distances.push(route.legs[i].distance.value);
    distanceTotal += route.legs[i].distance.value;
    
    durations.push(route.legs[i].duration.value);
    durationTotal += route.legs[i].duration.value;
  }
  
  var thisTripInfo = {
    length: route.legs.length,
    distances : distances,
    total_distance: distanceTotal,
    durations : durations,
    total_duration: durationTotal
  };
  return thisTripInfo;
}

