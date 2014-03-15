var map;
var markers = new Array();
var infowindows = new Array();
var activeMarker = null;
var showAllMarkers = false;
var directionsService = new google.maps.DirectionsService();  
var directionsDisplay;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(37.849923, -119.567666),
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    preserveViewport: true
  });

  directionsDisplay.setMap(map);
  initMarkers();
  initTrails();

  /*
  if (false) {
  var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.469523, -119.904577),
      new google.maps.LatLng(38.197833, -119.004523));

  historicalOverlay = new google.maps.GroundOverlay(
      '/static/img/maps/yose.jpg',
      imageBounds,
      { opacity: 0.8 });
  historicalOverlay.setMap(map);

    var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 1,
    strokeWeight: 1,
    fillOpacity: 0,
    map: map,
    bounds: imageBounds
  });

  } else {
  var imageBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.705595, -119.688373),
      new google.maps.LatLng(37.765755, -119.509571));

  historicalOverlay = new google.maps.GroundOverlay(
      '/static/img/maps/yosevalley.jpg',
      imageBounds,
      { opacity: 1 });
  historicalOverlay.setMap(map);

  var rectangle = new google.maps.Rectangle({
    strokeColor: '#FF0000',
    strokeOpacity: 1,
    strokeWeight: 1,
    fillOpacity: 0,
    map: map,
    bounds: imageBounds
  });

  }
  */

}
google.maps.event.addDomListener(window, 'load', initialize);


function calcRoute(start, end) {
  //var start = new google.maps.LatLng(37.716753,-119.646505);
  //var end = new google.maps.LatLng(37.755018, -119.597297);
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setMap(map);
      directionsDisplay.setDirections(response);
      //console.log(response);
    }
  });
}

function closeAllInfoWindows()
{
  infowindows.forEach(function(info) { info.close(); });
}

function initMarkers() {
  $(".poi-button").each(function(index) {
      var coordinate = $(this).find("> .coordinate").html().split(",");
      var lat = parseFloat(coordinate[0]);
      var lng = parseFloat(coordinate[1]);
      var name = $(this).find("> .poi-name").html();
      //console.log(name);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        visible: false
      });
      markers[index] = marker;

      var infowindow = new InfoBox({
        content: '<span class="infowindow-label">' + name + "</span>",
        disableAutoPan: true,
      });
      infowindows[index] = infowindow;

      google.maps.event.addListener(marker, 'mouseover', function() {
        closeAllInfoWindows();
        infowindow.open(map, marker);
      });
      google.maps.event.addListener(marker, 'mouseout', function() {
        closeAllInfoWindows();
      });
      

      try {
        $(this).click(function () {
          clearMap();
          marker.setVisible(true);
          marker.setMap(map);
          activeMarker = markers[index];
          map.panTo(marker.position);
          infowindow.open(map, marker);
          showAllMarkers = false;

          var info = $(this).parent().children(".poi-info");
          if (info && info.hasClass("expanded")) {
            info.slideToggle("50", "swing");
            info.removeClass("expanded");
            $(this).removeClass("selected");
          }
          else {
            $(".poi-button").each(function() {
              $(this).removeClass("selected");
              var info = $(this).parent().children(".poi-info");
              if (info && info.hasClass("expanded")) {
                info.slideToggle("50", "swing");
                info.removeClass("expanded");
              }
            });

            $(this).addClass("selected");
            if (info) {
              info.slideToggle("50", "swing");
              info.addClass("expanded");
            }
          }
        }); 
        $(this).mouseover(function () {
          if (activeMarker != marker && !marker.getVisible()) {
            marker.setVisible(true);
            marker.setMap(map);
            infowindow.open(map, marker);
          }
          else if (showAllMarkers)
            infowindow.open(map, marker);

          //if (activeMarker != null && activeMarker != marker) {
            //calcRoute(activeMarker.position, marker.position);
          //}
        }); 
        $(this).mouseout(function () {
          if (showAllMarkers)
            infowindow.close();
          else if (activeMarker != marker) {
            marker.setVisible(false);
            infowindow.close();
            directionsDisplay.setMap(null);
          }
        }); 
      }catch(e){}
  });
}

function initTrails()
{
  $(".trail-item").each(function(index) {
      var routeLines = []
      var bounds = null;
      var node = $(this);

      var getRouteLinesAndBounds = function()
      {
        if (routeLines.length > 0) return;
        var routes = getRoute(node.find("> .trail-route").html());
        routeLines = getRouteLines(routes);
        bounds = getRouteBounds(routes);
      };

      try {
        $(this).click(function () {
          getRouteLinesAndBounds();
          map.fitBounds(bounds);
        }); 
        $(this).mouseover(function () {
          getRouteLinesAndBounds();
          routeLines.forEach(function(line){ line.setVisible(true); });
        }); 
        $(this).mouseout(function () {
          routeLines.forEach(function(line){ line.setVisible(false); });
        }); 
      }catch(e){}
  });
}

function getRoute(trail_route, bounds)
{
  var steps = trail_route.split("|");
  var route = []; 
  var route_line = [];

  for (var i = 0; i < steps.length; ++i)
  {
    var coordinates = steps[i].split(";");
    var leg = [];
    for (var j = 0; j < coordinates.length; ++j)
    {
      var latlng_str = coordinates[j].split(",");
      var latlng = new google.maps.LatLng(latlng_str[0].split("(")[1], latlng_str[1].split(")")[0]);
      leg.push(latlng);
    }
    route.push(leg);
  }
  return route;
}

function getRouteLines(route)
{
  var routeLine = [];
  for (var i = 0; i < route.length; ++i)
  {
    var path = new google.maps.Polyline({
      path: route[i],
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.5,
      strokeWeight: 3
    });
    path.setMap(map);
    routeLine.push(path);
  }
  return routeLine;
}

function getRouteBounds(route)
{
  console.log(route[0]);
  var west = route[0][0].lng(), east = west,
      north = route[0][0].lat(), south = north;
  for (var i = 0; i < route.length; ++i)
    for (var j = 0; j < route[i].length; ++j)
    {
      west = Math.min(west, route[i][j].lng());
      east = Math.max(west, route[i][j].lng());
      north = Math.max(north, route[i][j].lat());
      south = Math.min(south, route[i][j].lat());
    }
  console.log(west+east);
  return new google.maps.LatLngBounds(
    new google.maps.LatLng(south, west),
    new google.maps.LatLng(north, east));
}

function clearMap() {
  activeMarker = null;
  for (var i = 0; i < markers.length; i++) {
    markers[i].setVisible(false);
    infowindows[i].close();
  }
}

$("#show-all-pois").click(function() {
    showAllMarkers = true;
    markers.forEach(function(marker){
      marker.setAnimation(google.maps.Animation.DROP);
      marker.setVisible(true);
    });
    closeAllInfoWindows();
    map.setZoom(10);
    map.panTo(new google.maps.LatLng(37.849923, -119.567666));
});

var prior_zoom;
var prior_center;
$(".zoom-button").each(function(index) {
    try {
    $(this).click(function () {
      if ($(this).html() == "+")
      {
        var current_button = $(this);
        var update_center = true;
        $(".zoom-button").each(function(index) {
          if ($(this) != current_button && $(this).html() == "-")
          {
            $(this).html("+");
            update_center = false;
          }
        });

        markers[index].setVisible(true);
        markers[index].setMap(map);
        infowindows[index].open(map, markers[index]);
        if (update_center)
        {
          prior_center = map.getCenter();
          prior_zoom = map.getZoom();
        }
        //center = map.setCenter();
        map.setCenter(markers[index].getPosition());
        map.setZoom(15);


        $(this).html("-");
      }
      else
      {
        map.setZoom(prior_zoom);
        map.setCenter(prior_center);
        $(this).html("+");
        if (markers[index] != activeMarker)
        {
          markers[index].setVisible(false);
          infowindows[index].close();
        }
      }
    }); 
    }catch(e){}
});
