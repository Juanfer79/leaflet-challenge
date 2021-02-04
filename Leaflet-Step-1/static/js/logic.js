
// Map object with starting position
let myMap = L.map('map').setView([37.76230904443554, -122.43193564741273], 4.5);

  // Add mapbox layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

//Set color for magnitudes
function getColor(feature){
    let color=""
    let magnitude=feature.properties.mag
    if(magnitude>5){
        color="#FF4500"
    } else if(magnitude>4){
        color="#FFA500"
    } else if(magnitude>3){
        color="#FFD700"
    } else if(magnitude>2){
        color="#FFFF00"
    } else if(magnitude>1){
        color="#ADFF2F"
    } else {
        color="#7FFF00"
    }
    return color
}
// Create function for marker size
let markers=[]
function markerSize(mag){
    return mag*15000
}
// Get coordinates
function getcoord(coordinates){
    array=[coordinates[1],coordinates[0]]
    return array
}

// get data from Geojson
url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(data=>{
    data["features"].forEach(d=>{
         L.circle(getcoord(d.geometry.coordinates),{
            stroke:false,
            fillOpacity:.75,
            color:getColor(d),
            fillColor:getColor(d),
            radius:markerSize(d.properties.mag)
            }).bindPopup(`<h3>Type: ${d.properties.type}</h3> <hr> <h3>Location: ${d.properties.place}</h3> <hr> <h3>Mag: ${d.properties.mag}</h3>`).addTo(myMap)
    })
})
.catch(e=>{
    console.log(e)
})

// Set up the legend
let legend = L.control({ 
    position: "bottomright"
 });
 let colors=["#7FFF00","#ADFF2F","#FFFF00","#FFD700","#FFA500","#FF4500"]
 let limits=["0-1","1-2","2-3","3-4","4-5","5+"]
 
legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let labels = [];

    // Add min & max
    let legendInfo = "<p>Magnitudes</p>" +
    "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

    div.innerHTML = legendInfo;

    // add the scale of colors with the values considered inside
    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">"+limit+"</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

// Adding legend to the map
legend.addTo(myMap);

