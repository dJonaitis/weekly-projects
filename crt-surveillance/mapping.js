// this file reads the dataset, and converts the names of countries into coordinates, putting it into a csv file with 4 columns: long1, lat1, long2, lat2
// SIPRIS contains data between 1950-2023
// https://armstransfers.sipri.org/ArmsTransfer/
// SIPRI TIV is value in millions of $


const data_path = "data/trade-register.csv";

class Country {
    constructor(name, volume){
        this.name = name;
        this.volume = volume;
    }
}

let countries = [];

d3.csv(data_path, function(data) {
    for (var i = 0; i < data.length; i++) {
        // console.log(data[i].Recipient);
        // console.log(data[i].SIPRI_TIV_of_delivered_weapons);
        let found = false;
        for(var j = 0; j < countries.length; j++){
            if(countries[j].name == data[i].Recipient){
                countries[j].volume += parseFloat(data[i].SIPRI_TIV_of_delivered_weapons);
                found = true;
                break;
            }
        }
        if(!found) countries.push(new Country(data[i].Recipient, parseFloat(data[i].SIPRI_TIV_of_delivered_weapons)));
    }
    console.log('reading csv')
    console.log(countries)
});

function get_index(country){
    for(var i = 0; i < countries.length; i++){
        if(countries[i].name == country){
            return i;
        }
    }
    return NaN
}

// this part of the file maps the coordinates

// Coordinates of the USA: 39.7837304, -100.445882

// The svg
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoNaturalEarth1()
    .scale(width / 1.3 / Math.PI)
    .translate([width/2, height/2])

// A path generator
var path = d3.geoPath()
    .projection(projection)

// Load world shape AND list of connection
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
  .defer(d3.csv, "data/usa_export_recipients.csv") // Position of countries
  .await(ready);

function ready(error, dataGeo, data) {
    console.log('sending data')
    var link = []
    data.forEach(function(row){
      source = [+-100.445882, +39.7837304]
      target = [+row.long, +row.lat]
      topush = {type: "LineString", coordinates: [source, target]}
      link.push(topush)
    })

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(dataGeo.features)
        .enter().append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "#fff")
            .style("stroke-width", 0)

    // Add the path
    svg.selectAll("myPath")
      .data(link)
      .enter()
      .append("path")
        .attr("d", function(d){ return path(d)})
        .style("fill", "none")
        .style("stroke", "#b3697a")
        // .style("stroke-width", 2)
        .style("stroke-width", function(d) { return (d.target.volume * 100); })
        .style("opacity", 0.5)

}
