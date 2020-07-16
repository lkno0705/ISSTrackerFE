// Mag gets created, for options check leaflet docu

var markerLatlng;
var menu;
var menuState;
var active;
var bStart = false;
var mymap;

// Leaflet map is created
function createMap() {
    mymap = L.map('mapid', {
        maxBoundsViscosity: 1,
        zoomControl: false,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'show coordinate',
            callback: showCoordinate
        }, {
            text: 'set marker',
            callback: setMarker
        }]
    }).on("zoomend", function(){ // event for map zoom to set circle size on GPX route
               var wpWidthHeight = (Math.sqrt((this.getZoom()/3))*(this.getZoom()/3)*(this.getZoom()/3)*30).toFixed(0);
        var offset = (wpWidthHeight/2).toFixed(0);
        var waypoints = document.getElementsByClassName("waypoints");
        if (waypoints){
            for (var i = 0; i < waypoints.length; i++){
                waypoints[i].style.height = wpWidthHeight + "px";
                waypoints[i].style.width = wpWidthHeight + "px";
                waypoints[i].style["margin-top"]= -offset + "px";
                waypoints[i].style["margin-left"]= -offset + "px";
            }
        }
    }).setView([0, 0], 7);

    // get map tiles from 'mapbox'
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 7,
        minZoom: 3,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery <a href="https://www.mapbox.com/">Mapbox</a>, ' +
            '<a href="impressum.html">Impressum</a> | '+
            '<a id="tutorial" href="javascript:openModal()">Help<i class="material-icons" style="font-size:10px">help</i></a>',
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    // add control layer
    L.control.zoom({position: "bottomright"}).addTo(mymap);

    // set map bounds
    var southWest = L.latLng(-75, -190), northEast = L.latLng(84, 190);
    var bounds = L.latLngBounds(southWest, northEast);

    mymap.setMaxBounds(bounds);

    //set context menu
    menu = document.querySelector(".context-menu");
    menuState = 0;
    active = "context-menu--active";

    mymap.on('contextmenu', function (e) {
        removePopUps();
        markerLatlng = e.latlng;
        toggleMenuOn(e.originalEvent);
    });

    //click event handler to remove all popups
    mymap.on('click', function () {
        removePopUps();
    });
    // after map is ready, KML is drawn
    callBackendDrawCounties(mymap);
}

// function to remove all popups on website
function removePopUps() {
    if (menuState == 1)
        toggleMenuOn();
    document.getElementById("issOnBoard").innerHTML = "";
    bCrewPopUp = false;
    routePopup[0].style.display = 'none';
}

// function to write date string for back end call
function getCurrentTime(past) { // past is minutes back in time
    var date = new Date();
    if (past) {
        var time = date.setTime(date.getTime() - past * 60 * 1000);
        date = new Date(time);
    }
    var day = pad(date.getUTCDate(), 2);
    var month = pad(date.getUTCMonth() + 1, 2);
    var year = date.getUTCFullYear();
    var hour = pad(date.getUTCHours(), 2);
    var minute = pad(date.getUTCMinutes(), 2);
    var seconds = pad(date.getUTCSeconds(), 2);

    return "" + year + "-" + month + "-" + day + " " + hour + "-" + minute + "-" + seconds;
}

// function to pad numbers, for date format
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

// get back end time string and parse it to JS time object and return locale time string
function parse2localTime(s) {
    s = s.split(" ")
    date = s[0];
    time = s[1];
    date = date.split("-");
    time = time.split("-");

    var oDate = new Date();
    oDate.setUTCDate(parseInt(date[2]));
    oDate.setUTCMonth(parseInt(date[1] - 1));
    oDate.setUTCFullYear(parseInt(date[0]));
    oDate.setUTCHours(parseInt(time[0]));
    oDate.setUTCMinutes(parseInt(time[1]));
    oDate.setUTCSeconds(parseInt(time[2]));
    test = oDate.toLocaleString();
    return oDate.toLocaleString();
}

// jQuery function to call all functions, needed for startup
$(document).ready(function () {
    changeCursor('wait');
    loadingText(1);
    var mymap;
    createMap();
    ISSCall(createISS);
    getRadiusSliderValue();
    getSliderValue();
    rssCall();
    countriesCallBackEnd();

    $('form input').keydown(function (e) { // catch key inputs in form field
        if (e.keyCode == 13) {
            e.preventDefault();
                start(false);
            return false;
        }
    });
    var showTutorial = getCookie("tutorial") == "true" ? false : true;
    document.getElementById("startupTutorialCB").checked = !showTutorial;
    if (showTutorial) {
      openModal();
    }

});

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
