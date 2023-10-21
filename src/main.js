import * as d3 from "d3";
import { feature } from "topojson"
import * as constants from "./constants.js"

const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);

const svg = d3.select("body").append("svg")
    .attr("width", constants.SVG_WIDTH)
    .attr("height", constants.SVG_HEIGHT);

const chart = svg.append("g").classed("chart", true);

// this is what takes the coordinates of the countries borders and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1()
    .translate([constants.SVG_WIDTH / 2, constants.SVG_HEIGHT / 2]);

console.log(projection.scale())
const pathGenerator = d3.geoPath().projection(projection); // this is creating paths (country shapes) from coordinates using the selected projection  

d3.json("../data/countries-50m.json").then(data => processData(data));

const data = [{ name: "Poland", amount: 2000 },
{ name: "Russia", amount: 4000 }];

const valueMap = new Map(data.map(d => [d.name, d.amount]));

console.log(valueMap);

svg.call(d3.zoom()
    .on("zoom", handleZoom));

function processData(data) {
    const countries = feature(data, data.objects.countries); // convert topojson to geojson
    console.log(countries);
    chart.selectAll("path")
        .data(countries.features) // that's the data points
        .join("path") // create a new path for each country
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => color(valueMap.get(d.properties.name)) ?? "blue")
        // alternatively, can say d => geoGenerator(d)  
        .append("title").text(d => d.properties.name);
}

function handleZoom(event) {
    chart.attr("transform", event.transform);
}
