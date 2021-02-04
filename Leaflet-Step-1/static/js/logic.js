// go to he website 
let endpoint = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-18&endtime=2021-01-25"

// starting point for the map
let myMap = L.map('map').setView([37.76230904443554, -122.43193564741273], 4.5);

// map properties
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    id: 'mapbox/light-v10',
    accessToken: API_KEY,
    title: "Earthquakes Mapping"
}).addTo(myMap);

// the array of colors and limits to use in the circles and in the label
let colors = ["#7FFF00","#ADFF2F","#FFFF00","#FFD700","#FFA500","#FF4500"]
let limits = ["0-1","1-2","2-3","3-4","4-5","5+"]

/**
 * Function that receives a feature from GeoJSON and according to magnitude decides
 * which color to return for the circles
 * @param {Object} feature from GeoJSON 
 * @param {Object} layer from Leaflet
 * @returns {String} containing the fillColor for the point
 */
function fillColor(feature,layer){
    // transform the property into a number
    let mag = +feature.properties.mag;
    // select the color depending on the magnitude
    if(mag > 0 && mag < 1){
        return colors[0]
    }else if(mag < 2){
        return colors[1]
    }else if(mag < 3){
        return colors[2]
    }else if(mag < 4){
        return colors[3]
    }else if(mag < 5){
        return colors[4]
    }else {
        return colors[5]
    }
}


// Read the endpoint to get the data from the USGS
d3.json(endpoint).then(data => {
    console.log(data)
    
    let myCircleStyle = {
        color: "black",
        weight: 1,
        opacity: 0.5,
        fillColor: "#088",
        fillOpacity: 0.75,
        radius: 8
    };
    
    // Add points to my map and change properties depending on properties of the feature
    let geojson = L.geoJson(data,{
        pointToLayer: function(data, latlng){
            myCircleStyle.radius = data.properties.mag*10;
            myCircleStyle.fillColor = fillColor(data,latlng)
            return L.circleMarker(latlng, myCircleStyle)
        },
        onEachFeature: onEachFeature //this calls the function to bind Popups on each feature
    }).addTo(myMap)
    
    // Add markers to my map
    // markers.addTo(myMap)

    // Set up the legend
    let legend = L.control({ 
        position: "bottomright"
     });

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let labels = [];


        // add the scale of colors with the values considered inside
        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\">"+limit+"</li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);

})
