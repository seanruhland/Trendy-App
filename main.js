var map;
var styleArray = [
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"   
      }
    ]
  },
  {
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      {
        "color": "#ffffff"
      },
      {
        "visibility": "on"
      }
    ]
  }
];
var laCoord = {lat: 34.0522, lng: -118.2437};
var mapOptions = {zoom: 13, center: laCoord, styles:styleArray, scrollwheel: false, disableDefaultUI: true};
var infoWindow = null;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}


// on document.ready()
$(function(){
  // initial AJAX to load initial view
  $.ajax({
    url: 'https://api.instagram.com/v1/locations/search?lat=34.0407&lng=-118.2468&distance=750m&access_token=244025605.dfda327.5632cfc76f1a4e02b1812c35a123e188',
    dataType:'jsonp',
    crossDomain: true,
    success : function(response) {
      var igPosts = response.data;
      console.log(response)
      mapContent(igPosts)
    }
  });

  // add form submit event handler
  $('#search-form').on('submit', function(event){
    // prevent refresh on submit
    event.preventDefault();
    // get user input
    var inputs = $('#search-form :input').val();
    // create new Geocoder instance
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': inputs}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // do something with the geocoded result
        var lat = results[0].geometry.location.lat();
        var long = results[0].geometry.location.lng();
        //ajax call to obtain new ig marker data and map

          updatedCoord = {lat: lat, lng: long};
          mapOptions.center = updatedCoord
          map = new google.maps.Map(document.getElementById('map'), mapOptions);
  
        $.ajax({
          url: 'https://api.instagram.com/v1/locations/search?lat=' + lat + '&lng=' + long + '&distance=750m&access_token=244025605.dfda327.5632cfc76f1a4e02b1812c35a123e188',
          dataType:'jsonp',
          crossDomain: true,
          success : function(response) {
            var igPosts=response.data;
            mapContent(igPosts)
          }
        })
      }
    });
  });

  // menu functionality
  $('.menu').click(function() {
    console.log('menu has been clicked');
    $('#sidebar').toggleClass('active')
  });
});



function mapContent(igPosts) {
  $('#names-list').empty();
  for (var i = 0; i < igPosts.length; i++) {
    var igPost = igPosts[i];
    var name = igPost.name;
    var latitude = igPost.latitude;
    var longitude = igPost.longitude;
    var markers = [];
    var pos = new google.maps.LatLng(latitude, longitude);
    var marker = markers[i] = new google.maps.Marker({
      position: pos,
      map: map,
      title: name
    });
    console.log('submitted')
    var infoWindow = new google.maps.InfoWindow({}); 
    var markerCluster = new MarkerClusterer(map, markers);
    

    var itemTemplate = $('#entry-template').html()
    var theTemplate = Handlebars.compile(itemTemplate)
    var context = {item: name};
    var html    = theTemplate(context);
    $('#names-list').append(html)
   
    google.maps.event.addListener(marker, 'click', function(e) {
      infoWindow.setContent(this.title);
      infoWindow.open(map, this)

    })
    
  } 
}


//orbs, bootstrap, twitter research for data


