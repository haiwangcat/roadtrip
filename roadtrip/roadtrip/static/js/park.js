var map;
var markers = new Array();
var infowindows = new Array();
var activeMarker = null;
var allMarkersShown = false;
var directionsService = new google.maps.DirectionsService();  
var directionsDisplay;
var selectedItemName;
var selectedItem = [];
var introPanelOn = false;
var priorZoom;
var priorCenter;
//var selectedItemGPS;

function initialize() {
  var mapOptions = {
    center: getLatLng($("#park-gps-coordinate").html()),
    zoom: parseInt($("#park-zoom").html())
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    preserveViewport: true
  });

  directionsDisplay.setMap(map);
  initMarkers();
  initTrails();
  initOfficialMap();
  initEventListeners();

  showAllMarkers();
}

google.maps.event.addDomListener(window, 'load', initialize);

function initEventListeners() {
  google.maps.event.addListener(map, 'click', function() {
    if (introPanelOn) {
      turnOffIntroPanel();
    }
  });

  $("#show-all-pois").click(function() {
    showAllMarkers();
  });
}

function initInfoPanelEventListeners() {
  $("#close-info-panel").click(function() {
    turnOffIntroPanel();
  });
}

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

function closeAllInfoWindows() {
  infowindows.forEach(function(info) { info.close(); });
}

function initMarkers() {
  $(".poi-button").each(function(index) {
    var poiID = $(this).parent().find("> .poi-id").html();
    var name = $(this).find("> .poi-name").html();
    var nameEn = $(this).find("> .poi-name-en").html();
    //console.log(name);

    var marker = new google.maps.Marker({
      position: getLatLng($(this).find("> .coordinate").html()),
      map: map,
      visible: false
    });
    markers[index] = marker;

    var infoBox = $(".infobox-label").first().clone();
    infoBox.removeClass("hidden");
    infoBox.find(".infobox-title-cn").html(name);
    infoBox.find(".infobox-title-en").html(nameEn);
    infoBox.click(function() {
      turnOnIntroPanel(poiID);
    });

    var infowindow = new InfoBox({
      content: infoBox[0],
      disableAutoPan: true,
      closeBoxURL: ''
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
        allMarkersShown = false;
        selectedItemName = $(this).find("> .poi-name").html();
        $("#overlay-content").html(name);
        //selectedItemGPS = $(this).find("> .coordinate").html().split(",");

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

      $(this).parent().mouseover(function () {
        if (activeMarker != marker && !marker.getVisible()) {
          marker.setVisible(true);
          marker.setMap(map);
          infowindow.open(map, marker);
        }
        else if (allMarkersShown)
          infowindow.open(map, marker);

        //if (activeMarker != null && activeMarker != marker) {
          //calcRoute(activeMarker.position, marker.position);
        //}
      }); 

      $(this).parent().mouseout(function () {
        if (allMarkersShown)
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

      var getRouteLinesAndBounds = function() {
        if (routeLines.length > 0) return;
        var routes = getRoute(node.find("> .trail-route").html());
        routeLines = getRouteLines(routes);
        bounds = getRouteBounds(routes);
      };

      try {
        $(this).click(function () {
          getRouteLinesAndBounds();
          map.fitBounds(bounds);
//	  activeItem = name;
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

  for (var i = 0; i < steps.length; ++i) {
    var coordinates = steps[i].split(";");
    var leg = [];
    for (var j = 0; j < coordinates.length; ++j) {
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
  for (var i = 0; i < route.length; ++i) {
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
    for (var j = 0; j < route[i].length; ++j) {
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


function showAllMarkers() {
  if (allMarkersShown==false){
    markers.forEach(function(marker){
      marker.setAnimation(google.maps.Animation.DROP);
      marker.setVisible(true);
      allMarkersShown = true;
		});
	}
  else {
    markers.forEach(function(marker){
      marker.setVisible(false);
      allMarkersShown = false;
		});
	}
  closeAllInfoWindows();
  toParkView();
}

function toParkView() {
  var zoom = parseInt($("#park-zoom").html()) 
  map.panTo(getLatLng($("#park-gps-coordinate").html()));
  map.setZoom(zoom);
}

function getLatLng(coordinate) {
  var latlng = coordinate.split(",");
  var lat = parseFloat(latlng[0]);
  var lng = parseFloat(latlng[1]);
  return new google.maps.LatLng(lat, lng);
}

function initOfficialMap() {
  $("#show-official-map").each(function() {
      var mapOverlay = null;
      var mapFrame = null;
      var imageBounds = null;

      imageBounds = new google.maps.LatLngBounds(
        getLatLng($("#park-map-sw-bound").html()),
        getLatLng($("#park-map-ne-bound").html()));

      mapOverlay = new google.maps.GroundOverlay(
        $("#park-map-filename").html(),
        imageBounds,
        { opacity: 0.8, clickable: false }
      );
      //mapOverlay.setMap(map);

      mapFrame = new google.maps.Rectangle({
        strokeColor: 'green',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0,
        bounds: imageBounds,
        map: map,
        visible: false
      });
  

      $(this).click(function() {
        if (mapOverlay.getMap() != null) {
          mapOverlay.setMap(null);
          mapFrame.setVisible(false);
        }
        else {
          mapOverlay.setMap(map);
          // A trick to force refreshing the map so that the mapOverlay can be shown.
          map.setZoom(map.getZoom()+1);
          map.setZoom(map.getZoom()-1);
          map.setCenter(imageBounds.getCenter());
          var bounds = map.getBounds();
          map.setZoom(8);
          while (true) {
            if (map.getBounds().contains(imageBounds.getNorthEast()) &&
                map.getBounds().contains(imageBounds.getSouthWest()))
              map.setZoom(map.getZoom()+1);
            else {
              map.setZoom(map.getZoom()-1);
              break;
            }
          }
          mapFrame.setVisible(true);
        }
      });
  });
}

function turnOnIntroPanel(poiID) {
  var mapCanvas = $("#map-canvas");
  var width = parseInt(mapCanvas.css("width")) - 100;
  var left = parseInt(mapCanvas.css("left"));
  $("#overlay-content").css("width", width);
  $("#overlay-panel").css("left", left+50);
  $("#overlay-panel").show();
  $("#overlay-content").load('/get-poi-info/?poi=' + poiID, function() {
    initInfoPanelEventListeners();
  });
  introPanelOn = true;
}

function turnOffIntroPanel() {
  $("#overlay-panel").hide();
    introPanelOn = false;
}

$(".zoom-button").each(function(index) {
    $(this).click(function () {
      turnOnIntroPanel($(this).parent(".poi-item").find(".poi-id").html());
    });
    /*
    try {
    $(this).click(function () {
      if ($(this).find(".icon-pic").attr('src') == '/static/img/zoom12.svg')
      {
        var current_button = $(this);
        var update_center = true;
        $(".zoom-button").each(function(index) {
          if ($(this) != current_button && $(this).find(".icon-pic").attr('src') == '/static/img/zoom9.svg')
          {
            $(this).find(".icon-pic").attr('src','/static/img/zoom12.svg');
            update_center = false;
          }
        });

        markers[index].setVisible(true);
        markers[index].setMap(map);
        infowindows[index].open(map, markers[index]);
        if (update_center)
        {
          priorCenter = map.getCenter();
          priorZoom = map.getZoom();
        }
        //center = map.setCenter();
        map.setCenter(markers[index].getPosition());
        map.setZoom(15);


        $(this).find(".icon-pic").attr('src','/static/img/zoom9.svg');
      }
      else
      {
        map.setZoom(priorZoom);
        map.setCenter(priorCenter);
        $(this).find(".icon-pic").attr('src','/static/img/zoom12.svg');
        if (markers[index] != activeMarker)
        {
          markers[index].setVisible(false);
          infowindows[index].close();
        }
      }
    }); 
    }catch(e){}
    */
});

$('.side-nav-category').each(function(index){
	$('.sidebar-food').hide();
	$('.sidebar-hotel').hide();
	$(this).click(function(){
		if ($(this).children('hl').html() == '景点') {		
			$('.sidebar-poi').show();
			$('.sidebar-hotel').hide();
			$('.sidebar-food').hide();
		}
		else if ($(this).children('hl').html() == '饕餮') {
			$('.sidebar-poi').hide();
			$('.sidebar-hotel').hide();
			$('.sidebar-food').show();
		}
		else if ($(this).children('hl').html() == '客栈') {
			$('.sidebar-poi').hide();
			$('.sidebar-hotel').show();
			$('.sidebar-food').hide();
		}

	});
});



/*
    $('#sidebar-forward').click(function() {
        var target = $(".sidebar-item-list").first().next(),
            other = target.siblings('.active');
        
        if (!target.hasClass('active')) {
            other.each(function(index, self) {
                $(this).removeClass('active').animate({
                    left: -other.width()
                }, 400);
            });

            target.addClass('active').show().css({
                left: target.width()
            }).animate({
                left: 0//$this.width()
            }, 400);
        }
    });

    $('#sidebar-back').click(function() {
        var $target = $(".sidebar-item-list").first(),
            $other = $target.siblings('.active');
        
        if (!$target.hasClass('active')) {
            $other.each(function(index, self) {
                var $this = $(this);
                $this.removeClass('active').animate({
                    left: $this.width()
                }, 400);
            });

            $target.addClass('active').show().css({
                left: -($target.width())
            }).animate({
                left: 0
            }, 400);
        }
    });
    */
