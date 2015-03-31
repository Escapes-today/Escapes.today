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
    ['Milan Cathedral Tour', 45.464102, 9.191919, 'assets/img/Italy/milan_poi.jpg', [
        [45.464087, 9.189659000000006],
        [83.08716247365916, 20.8979432206712, 1.99]
    ]],
    ['Trevi Fountain Tour', 41.900931, 12.483313, 'assets/img/Italy/trevi_poi.jpg', [
        [41.900845, 12.483357000000069],
        [-15.841324202271354, 6.781721590935567, 1]
    ]],
    ['Tower of Pisa Tour', 43.722952, 10.396597, 'assets/img/Italy/pisa_poi.jpg', [
        [43.722963, 10.397140000000036],
        [-38.067682546933696, 23.540597461396413, 1.33]
    ]],
    ['La Pergonla Italian Restaurant', 41.918833, 12.446494, 'assets/img/Italy/LaPergola_poi.jpg', [
        [41.918825, 12.445901000000049],
        [94.46519433298454, 20.98201249691098, 0.3299999999999999]
    ]],
    ['Albergo del Senato Hotel', 41.899192, 12.4773742, 'assets/img/Italy/albergo_poi.jpg', [
        [41.899197, 12.476933000000031],
        [-98.5602501893209, 8.056225356480065, 1.33]
    ]]
];

var bound = new google.maps.LatLngBounds();
var allMarkers = [];

function setupMap() {
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

    for (var j = 0; j < locations.length; j++) {
        //  addPOIMapPoint(locations[j][1], locations[j][2], locations[j][0], locations[j][3], locations[j][4]);
    }
    console.log(locations[0][5]);

    //showStreetView(locations[0][4]);
}


function addPOIMapPointByName(name) {
    for (var j = 0; j < locations.length; j++) {
        if (locations[j][0] == name) {
			addPOIMapPoint(locations[j][1], locations[j][2], locations[j][0], locations[j][3], locations[j][4]);
		}
    }
}

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
                html = '<div class="poiInfo" style="width:300px;padding-left:20px;"><h2 style="padding:10px;text-align:center">' + name + '</h2><img src="' + image + '" style="height:100%;width:100%"><div class="btns" style="float:right;text-align: center;width: 100%;"> <a class="btn" href="javascript:showStreetView([[' + info[0] + '],[' + info[1] + ']])" style="   margin-left: 0;   text-align: left;">Eye View<i class="fa fa-eye" style="    margin-left: 12px;    font-size: 17px;"></i></a><a class="btn" href="javascript:null" style="    text-align: right;    margin-left: 48px;">Remove Item</a></div></div>';
            } else {
                html = '<div class="poiInfo" style="width:300px;padding-left:20px;"><h2 style="padding:10px;text-align:center">' + name + '</h2><img src="' + image + '" style="height:300px;width:300px"><div class="btns" style="text-align: center;width: 100%;"><a class="btn" href="javascript:null" style="    text-align: right;    margin-left: 0px;">Remove Item</a></div></div>';

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

function remPOIMapPointByName(name){
	   for (var i = 0; i < allMarkers.length; i++) {
       if(name == allMarkers[i].title){
		 allMarkers[i].setMap(null);
   }
	}
}

//Automatically sets the zoom of the map to show all the points
function updateMapZoom() {
    for (var i = 0; i < allMarkers.length; i++) {
        console.log(i + " " + allMarkers[i].position);
        bound.extend(allMarkers[i].getPosition());
    }
    map.fitBounds(bound);
    // map.setZoom(map.getZoom() -1);
    if (map.getZoom() > 15) {
        map.setZoom(15);
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