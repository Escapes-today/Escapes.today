var map;
var infowindow = new google.maps.InfoWindow();

var locations = [
//Milan Cathedral
    ['sadgfads', 45.464102, 9.191919, 4],
    ['Trevi Fountain', 41.900932, 12.483311, 5],
    ['Tower of Pisa', 43.722952, 10.396597, 3],
    ['La Pergonla', 41.918833, 12.446494, 2],
    ['Albergo del Senato', 41.899192, 12.4773742, 1]
];
var bound = new google.maps.LatLngBounds();
var allMarkers = [];
var markerH;
$(document).ready(function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(0, 0),
        zoom: 15
    });

    for (i = 0; i < locations.length; i++) {
        callPOIService(locations[i][1], locations[i][2], locations[i][0]);
    }
});

//Calls service to use poi name instead of backup coords
function callPOIService(lat, lng, name) {
    var request = {
        location: new google.maps.LatLng(lat, lng),
        radius: '1000',
        query: name
    };
    markerH = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
                 });
    

    var service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

// Checks that the PlacesServiceStatus is OK, and adds a marker
// using the place ID and location from the PlacesService.
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        marker = new google.maps.Marker({
            map: map,
            place: {
                placeId: results[0].place_id,
                location: results[0].geometry.location
            }
        });
    } else {
		markerH.setMap(map);
		marker = markerH;	
		console.log(marker);
	}
    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
            var html = '<div style="width:300px"><h2 style="padding:10px;text-align:center">Trevi Fountain Tour</h2><img src="./maps2_files/trevi_poi.jpg" style="height:300px;width:300px"><div class="btns" style="text-align:right"> <a class="btn" href="javascript:null">Remove</a></div></div>';
            infowindow.setContent(html);
            infowindow.open(map, marker);
        }
    })(marker));
    allMarkers.push(marker);
	updateMapZoom();
}


function addPOIMapPoint(){
}

//Automatically sets the zoom of the map to show all the points
function updateMapZoom(){
	 for (i = 0; i < allMarkers.length; i++) {
		 console.log(i + " "  + allMarkers[i].position);
        bound.extend(allMarkers[i].getPosition());
    }
    map.fitBounds(bound);
    // map.setZoom(map.getZoom() -1);
    if (map.getZoom() > 15) {
        map.setZoom(15);
    }
}