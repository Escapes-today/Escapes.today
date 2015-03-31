var map;
var infowindow;
/* Each location array contains:
	name
	lat
	lng
	img
	info
		street view pos
			lat
			lng
		street view info
			heading
			pitch
			zoom		
*/
var locations = [
    ['Imperial Palace Tour', 35.685177, 139.752790, 'assets/img/Italy/milan_poi.jpg', [
        [35.688692, 139.75214900000003],
        [-22.780781060801058, 11.262987736104488, 0.6699999999999999]
    ]],
    ['Mount Fuji Bike Tour', 35.360560, 138.727752, 'assets/img/Italy/trevi_poi.jpg', [
        [ 35.360565, 138.72778100000005],
        [115.0601968682149, 15.232870499796768, 1]
    ]],
    ['Kōtoku-in Tour', 35.316694, 139.536154, 'assets/img/Italy/pisa_poi.jpg', [
        [35.316692, 139.53570000000002],
        [11.990795936962162, 28.117036097369198, 1.33]
    ]],
    ['Imperial Hotel', 41.918833, 12.446494, 'assets/img/Italy/LaPergola_poi.jpg', [
        [41.918825, 12.445901000000049],
        [94.46519433298454, 20.98201249691098, 0.3299999999999999]
    ]],
    ['Nippon Rent-a-Car', 41.899192, 12.4773742, 'assets/img/Italy/albergo_poi.jpg', [
        [41.899197, 12.476933000000031],
        [-98.5602501893209, 8.056225356480065, 1.33]
    ]]
];

var allMarkers = [];

function setupMap(destinations) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        minZoom: 1,
        maxZoom: 20
    });
    infowindow = new google.maps.InfoWindow();

    //Preload Images
    /*    for (var j = 0; j < locations.length; j++) {
        $('<img/>')[0].src = locations[j][3];
    }*/

    for (var j = 0; j < destinations.length; j++) {
        addPOIMapPointByName(destinations[j]);
        //  addPOIMapPoint(locations[j][1], locations[j][2], locations[j][0], locations[j][3], locations[j][4]);
    }
}

//Adds a poing based off of the name to the map
function addPOIMapPointByName(name) {
    for (var j = 0; j < locations.length; j++) {
        if (locations[j][0] == name) {
            addPOIMapPoint(locations[j][1], locations[j][2], locations[j][0], locations[j][3], locations[j][4]);
        }
    }
}

//Adds a point to the map based off of locations array information
function addPOIMapPoint(lat, lng, name, image, info) {
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        title: name
    });

    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
            var html;
            //If it has street view information
            if (info != null) {
                html = '<div class="poiInfo" style="width:300px;padding-left:20px;"><h2 style="padding:10px;text-align:center">' + name + '</h2><img src="' + image + '" style="height:100%;width:100%"><div class="btns" style="float:right;text-align: center;width: 100%;"> <a class="btn" href="javascript:showStreetView([[' + info[0] + '],[' + info[1] + ']])" style="   margin-left: 0;   text-align: left;">Eye View<i class="fa fa-eye" style="    margin-left: 12px;    font-size: 17px;"></i></a><a class="btn" href="javascript:remove(\'' + name + '\')" style="    text-align: right;    margin-left: 48px;">Remove Item</a></div></div>';
            } else {
				html = '<div class="poiInfo" style="width:300px;padding-left:20px;"><h2 style="padding:10px;text-align:center">' + name + '</h2><img src="' + image + '" style="height:100%;width:100%"><div class="btns" style="float:right;text-align: center;width: 100%;"> <a class="btn" href="javascript:remove(\'' + name + '\')" style="    text-align: right;    margin-left: 0px;">Remove Item</a></div></div>';
            }
            infowindow.setContent($(html).get(0));
            infowindow.open(map, marker);
            //Add custom drop shadow to infowindow
            //$(".poiInfo").parents().css("display","block");
            $(".poiInfo").parent().parent().parent().css("box-shadow", "0 20px 90px rgba(0, 0, 0, 0.6)");
        }
    })(marker));
    allMarkers.push(marker);
    updateMapZoom();
}

//Removes a point from the map by name and updates the zoom
function remPOIMapPointByName(name) {
    for (var i = 0; i < allMarkers.length; i++) {
        if (name == allMarkers[i].title) {
            allMarkers[i].setMap(null);
            allMarkers.splice(i, 1);
            updateMapZoom();
        }
    }
}

//Automatically sets the zoom of the map to show all the points
function updateMapZoom() {
    var bound = new google.maps.LatLngBounds();
    for (var i = 0; i < allMarkers.length; i++) {
        console.log(i + " " + allMarkers[i].position);
        bound.extend(allMarkers[i].getPosition());
    }
    if (allMarkers.length > 0) {
        map.fitBounds(bound);
		if (allMarkers.length == 1) {
			 map.setZoom(12);
		}
    } else {
        map.setCenter(new google.maps.LatLng(0, 0));
        map.setZoom(1);
    }
}

//Shows the street view for a given place
function showStreetView(info) {
    var pos = new google.maps.LatLng(info[0][0], info[0][1]);
    var pov = {
        heading: info[1][0],
        pitch: info[1][1],
        zoom: info[1][2]
    };
    panorama = map.getStreetView();
    panorama.setPosition(pos);
    panorama.setPov( /** @type {google.maps.StreetViewPov} */ pov);
    //Fix temp incorrect location bug
    panorama.setVisible(false);
    panorama.setVisible(true);
}