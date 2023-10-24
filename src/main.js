import * as d3 from "d3";
import { feature } from "topojson"
import * as constants from "./constants.js"

const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);

const svg = d3.select("body").append("svg")
    .attr("width", constants.SVG_WIDTH)
    .attr("height", constants.SVG_HEIGHT);

const chart = svg.append("g").classed("chart", true).attr("fill", "black");

// this is what takes the coordinates of the countries borders and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1()
    .translate([constants.SVG_WIDTH / 2, constants.SVG_HEIGHT / 2]);

const pathGenerator = d3.geoPath().projection(projection); // this is creating paths (country shapes) from coordinates using the selected projection  

d3.csv("../data/production.csv").then(function (coffeeData) {
    color.domain([
        d3.min(coffeeData, d => d["2019/20"]),
        d3.max(coffeeData, d => d["2019/20"])
    ]);

    d3.json("../data/countries-50m.json").then(function (geoData) {
        const countries = feature(geoData, geoData.objects.countries).features;
        // merge the dataset into the geojson as we need a single dataset to bind
        for (let i = 0; i < coffeeData.length; i++) {
            let coffeeCountry = coffeeData[i].Country;
            let coffeeAmount = parseFloat(coffeeData[i]["2019/20"]);
            //console.log(coffeeCountry + " " + coffeeAmount);

            for (var j = 0; j < countries.length; j++) {
                let geoCountry = countries[j].properties.name;
                if (coffeeCountry == geoCountry) {
                    countries[j].properties.value = coffeeAmount;
                    break;
                }

            }
        }
        // get the value for a specific country 
        //console.log(countries.filter(d => d.properties.name == "Zimbabwe")[0].properties.value);

        chart.selectAll("path")
            .data(countries) // that's the data points
            .join("path") // create a new path for each country
            .classed("country", true)
            .attr("d", pathGenerator) // that's the actual coordinates of the path 
            .attr("fill", d => color(d.properties.value) ?? "#ccc")
            .attr("stroke", "black")
            // alternatively, can say d => geoGenerator(d)  
            .append("title").text(d => d.properties.name + " " + d.properties.value);
    })
});

function handleZoom(event) {
    chart.attr("transform", event.transform);
}

function getCountryNames(features) {
    return features.map(d => d.properties.name)
}
