var map;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(38.508321, -97.500938),
    zoom: 5
  };
  map = new google.maps.Map(document.getElementById("map-canvas-full"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
