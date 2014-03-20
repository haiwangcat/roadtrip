var directionWaypoints = new Array ();
var waypoint = {
	location: '',
	stopover: true
};

var showDirectionSwitch;
var selectedItem = {
  name: '',
  lat: '',
  lng: ''
};
var selectedItemList = new Array();

$("#add-to-trip-button").click(function(){
		var itemName = selectedItem.name;
		var itemLat = selectedItem.lat;
		var itemLng = selectedItem.lng;
		var itemCount = selectedItemList.length;

		var thisItem = {};
		thisItem.name = itemName;
		thisItem.lat = itemLat;
		thisItem.lng = itemLng;
		selectedItemList.push(thisItem);
	
		$('#item-name').append('->');
		$('#item-name').append(itemName);	
		console.log(selectedItemList);	
});	

$('#show-direction-button').click(function(){
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
