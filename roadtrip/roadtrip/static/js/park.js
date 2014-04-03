var map;
var markers = new Array();
var markerStatus = new Array();
var infowindows = new Array();
var activeMarkerIndex = -1;
var allMarkersShown = false;
var directionsService = new google.maps.DirectionsService();  
var directionsDisplay;

var introPanelOn = false;
var priorZoom;
var priorCenter;
var inactiveMarkerZIndex = 1998;
var activeMarkerZIndex = inactiveMarkerZIndex + 1;

function initialize() {
  var mapOptions = {
    center: getLatLng($("#park-gps-coordinate").html()),
    zoom: parseInt($("#park-zoom").html())
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: false,
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
    if (introPanelOn)
      turnOffIntroPanel();
    if (activeMarkerIndex >= 0) {
      infowindows[activeMarkerIndex].setVisible(false);
      activeMarkerIndex = -1;
    }
  });

  $("#show-all-pois").click(function() {
    //showAllMarkers();
  });

  $(".register").click(function(event) {
    event.preventDefault();
    $("#disabled-area").show();
    $("#register-view").show();
    $("#login-view").hide();
  });

  $(".login").click(function(event) {
    event.preventDefault();
    $("#disabled-area").show();
    $("#register-view").hide();
    $("#login-view").show();
  });

  $("#disabled-area").click(function() {
    $("#disabled-area").hide();
  });

  $("#register-view, #login-view").click(function(event){
    event.stopPropagation();
  });

  $(".side-nav-category").each(function(index){
    $(".poi-item").hide();
    $(".attraction-item").show();

    if (index == 0) {
      setMarkerStatus();
      showAllMarkers();
    }
                               
    $(this).click(function() {
      $(".poi-item").hide();
      if ($(this).is("#side-nav-attraction")) {    
        $('.attraction-item').show();
      }
      else if ($(this).is("#side-nav-drive")) {
        $(".food-item").show();
      }
      else if ($(this).is("#side-nav-hotel")) {
        $(".hotel-item").show();
      }
      else if ($(this).is("#side-nav-restaurant")) {
        $(".road-item").show();
      }
      setMarkerStatus();
      showAllMarkers();
    });
  });

  $("#user-create-account").click(function(event) {
    $("input.required").each(function() {
      if ($(this).val().trim() == "") {
        $(this).addClass("alert");
      }
    });

    var data = {
      username: $("#user-username").val(),
      password: $("#user-password").val(),
      password: $("#user-password").val(),
      password_confirm: $("#user-password-confirmation").val(),
      email: $("#user-email").val(),
    };
    console.log("!");
    $.post('/register/', data, function(response, status) {
      $(".response-info").html(response);
      console.log('response:' + response + '\n' + 'status:' + status);
    });
    event.preventDefault();
    //event.preventDefault();
  });
}

function initInfoPanelEventListeners() {
  $(".close-info-panel").click(function() {
    turnOffIntroPanel();
  });
}

function setMarker(m, color) {
  m.setIcon({
    path: "M18.764,1.714c-9.697,0-17.584,7.89-17.584,17.583c0,9.696,14.927,20.239,17.584,33.522 c2.529-13.661,17.582-23.827,17.583-33.522C36.347,9.604,28.459,1.714,18.764,1.714z M18.764,32.634 c-7.603,0-13.789-6.186-13.789-13.788c0-7.603,6.186-13.789,13.789-13.789c7.601,0,13.788,6.186,13.788,13.789 C32.552,26.448,26.365,32.634,18.764,32.634z",
    scale: 1/2,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: color,
    strokeWeight: 0,
    anchor: new google.maps.Point(20, 50)
  });
  m.setZIndex(inactiveMarkerZIndex);
}

function inactivateMarker(m) {
  setMarker(m, '#1ea5ad');
  m.setZIndex(inactiveMarkerZIndex);
};

function activateMarker(m) {
  setMarker(m, '#b61f25');
  m.setZIndex(activeMarkerZIndex);
};

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

function closeAllInfoWindows(keepOpen) {
  infowindows.forEach(function(info) {
    if (info != keepOpen) {
      info.hide();
      info.setZIndex(2000);
    }
  });
}

function setMarkerStatus(){
  $(".poi-button").each(function(index) {
    var status = 1;
    if ($(this).is(':hidden')){
      status = 0;
    }
  markerStatus[index] = status;
  });
}



function initMarkers() {
  $(".poi-button").each(function(index) {
    var poiID = $(this).find("> .poi-id").html();
    var name = $(this).find("> .poi-name").html();
    var nameEn = $(this).find("> .poi-name-en").html();
    var infowindow = null;
    var infoBox = null;

    var selected = false;

    var marker = new google.maps.Marker({
      position: getLatLng($(this).find("> .coordinate").html()),
      map: map,
      visible: false,
    });
    markers[index] = marker;

    var inactivateAllMarkers = function() {
      activeMarkerIndex = -1;
      for (var i = 0; i < markers.length; i++) {
        inactivateMarker(markers[i]);
        if (infowindows[i])
          infowindows[i].hide();
      }
    };

    var showInfoWindow = function() {
      if (infowindow == null) {
        $(".infobox-label").each(function() {
          if ($(this).find(".poi-id").first().html() == poiID)
            infoBox = $(this);
        });
        infoBox.removeClass("hidden");
        infoBox.click(function() {
          turnOnIntroPanel(poiID);
        });

        infowindow = new InfoBox({
          content: infoBox[0],
          disableAutoPan: true,
          closeBoxURL: '',
          isHidden: true,
        });
        infowindows[index] = infowindow;
        infowindow.open(map, marker);
        infowindow.setZIndex(2000);
      }
      infowindow.show();
    }

    var showInfoBox = function() {
      showInfoWindow();
      infoBox.hide();
      infoBox.fadeIn(500); 
    };

    var showInfoBoxOnClick = function() {
      closeAllInfoWindows(infowindow);
      //showInfoBox();
      showInfoWindow();
      infowindow.setZIndex(1999);
      activeMarkerIndex = index;
      selected = true;
    };

    var node = $(this);
    var selectPOIItem = function() {
      var info = node.parent().find(".poi-info");
      if (info && info.hasClass("expanded")) {
        info.slideToggle("50", "swing");
        info.removeClass("expanded");
        node.removeClass("selected");
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

        node.addClass("selected");
        if (info) {
          info.slideToggle("50", "swing");
          info.addClass("expanded");
        }
        var position = $(".poi-button").filter(":visible").index(node) * parseInt(node.css("height"));

        $(".poi-list").animate({
          scrollTop: position,
        }, 300);
      }
    };

    google.maps.event.addListener(marker, 'click', function() {
      inactivateAllMarkers();
      activateMarker(marker);
      showInfoBoxOnClick();
      selectPOIItem();
    });

    google.maps.event.addListener(marker, 'mouseover', function() {
      if (activeMarkerIndex < 0)
        closeAllInfoWindows(null);
      if (activeMarkerIndex != index) {
        showInfoBox();
      }
      activateMarker(marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
      if (activeMarkerIndex != index) {
        infowindow.hide();
        inactivateMarker(marker);
      }
    });

    
    try {
      $(this).click(function () {
        //clearMap();
        //marker.setVisible(true);
        //marker.setMap(map);

        inactivateAllMarkers();
        activateMarker(marker);
        activeMarkerIndex = index;
        map.panTo(marker.position);
        showInfoBoxOnClick();
        //allMarkersShown = false;
        
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

      $(this).parent().mouseenter(function () {
        if (activeMarkerIndex != index) {
          marker.setVisible(true);
          //marker.setMap(map);
          showInfoBox();
        }
        activateMarker(marker);
        //if (activeMarkerIndex != null && activeMarkerIndex != marker) {
          //calcRoute(activeMarkerIndex.position, marker.position);
        //}
      }); 

      $(this).parent().mouseleave(function () {
        if (activeMarkerIndex != index) {
          infowindow.hide();
          directionsDisplay.setMap(null);
          inactivateMarker(marker);
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
//    activeItem = name;
        }); 
        $(this).mouseenter(function () {
          getRouteLinesAndBounds();
          routeLines.forEach(function(line){ line.setVisible(true); });
        }); 
        $(this).mouseleave(function () {
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
 // console.log(route[0]);
  var west = route[0][0].lng(), east = west,
      north = route[0][0].lat(), south = north;
  for (var i = 0; i < route.length; ++i)
    for (var j = 0; j < route[i].length; ++j) {
      west = Math.min(west, route[i][j].lng());
      east = Math.max(west, route[i][j].lng());
      north = Math.max(north, route[i][j].lat());
      south = Math.min(south, route[i][j].lat());
    }
  //console.log(west+east);
  return new google.maps.LatLngBounds(
    new google.maps.LatLng(south, west),
    new google.maps.LatLng(north, east));
}

function clearMap() {
  activeMarkerIndex = -1;
  for (var i = 0; i < markers.length; i++) {
    markers[i].setVisible(false);
    infowindows[i].hide();
  }
}


function showAllMarkers() {
  markers.forEach(function(marker) {
    marker.setVisible(false);
    var position = markers.indexOf(marker);
    var status = markerStatus[position];
    if (status == 1) {
      marker.setAnimation(google.maps.Animation.DROP);
      marker.setVisible(true);
      inactivateMarker(marker);
    }
    else if (status == 0) {
      marker.setVisible(false);
    }
  });
  closeAllInfoWindows(null);
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
      strokeColor: 'white',
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
  var width = parseInt(mapCanvas.css("width"));
  var left = (width - parseInt($("#overlay-panel").css("width"))) / 2 + parseInt(mapCanvas.css("left"));
  $("#overlay-panel").css("left", left);
  $("#overlay-content").load('/get-poi-info/?poi=' + poiID, function() {
    $("#overlay-panel").show();
    initInfoPanelEventListeners();
    introPanelOn = true;
  });
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
      if (markers[index] != activeMarkerIndex)
      {
        markers[index].setVisible(false);
        infowindows[index].close();
      }
    }
  }); 
  }catch(e){}
  */
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
