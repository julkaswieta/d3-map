import * as d3 from "d3";
import { feature } from "topojson"
import * as constants from "./constants.js"
import { sliderBottom } from "d3-simple-slider";

const color = d3.scaleLinear([1, 10], d3.schemeBlues[9]);

const svg = d3.select("#app").append("svg")
    .attr("width", constants.SVG_WIDTH)
    .attr("height", constants.SVG_HEIGHT);

const chart = svg.append("g").classed("chart", true);
// this is what takes the coordinates of the countries borders and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1();

const pathGenerator = d3.geoPath().projection(projection); // this is creating paths (country shapes) from coordinates using the selected projection

const slider = sliderBottom();

const sliderBox = d3.select('#slider')
    .append('svg')
    .attr('width', 1100)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

let year = "2019";

d3.csv("../data/production.csv").then(function (coffeeData) {
    color.domain([
        d3.min(coffeeData, d => d[year]),
        d3.max(coffeeData, d => d[year])
    ]);

    let values = coffeeData.map(value => value[year]);
    console.log(values);
    coffeeData.columns.shift(); // get the columns and remove the first one ("Country")
    let years = coffeeData.columns;
    console.log(coffeeData.columns);

    let yearsNumbers = years.map(year => +year.slice(0, 4))
    console.log(yearsNumbers);

    d3.json("../data/countries-110m.json").then(function (geoData) {
        const geoJson = feature(geoData, geoData.objects.countries);
        const countries = geoJson.features;
        // fill up the svg element with the map
        projection.fitExtent([[0, 0], [constants.SVG_WIDTH, constants.SVG_HEIGHT]], geoJson);
        // merge the dataset into the geojson as we need a single dataset to bind
        loadCoffeeData(coffeeData, countries);

        slider.min(d3.min(yearsNumbers))
            .max(d3.max(yearsNumbers))
            .tickValues(yearsNumbers)
            .step(1)
            .width(1000)
            .tickFormat(d3.format("")) // removes the comma in thousands
            .displayValue(true)
            .default(2019)
            .on("onchange", function (val) {
                year = val;
                loadCoffeeData(coffeeData, countries);
            })

        sliderBox.call(slider);

        // get the value for a specific country 
        //console.log(countries.filter(d => d.properties.name == "Zimbabwe")[0].properties.value);
    })
});

function loadCoffeeData(coffeeData, countries) {
    for (let i = 0; i < coffeeData.length; i++) {
        let coffeeCountry = coffeeData[i].Country;
        let coffeeAmount = parseFloat(coffeeData[i][year]);
        //console.log(coffeeCountry + " " + coffeeAmount);

        for (var j = 0; j < countries.length; j++) {
            let geoCountry = countries[j].properties.name;
            if (coffeeCountry == geoCountry) {
                countries[j].properties.value = coffeeAmount;
                break;
            }
        }
    }

    chart.selectAll("path")
        .data(countries) // that's the data points
        .join("path") // create a new path for each country
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => color(d.properties.value) ?? "#ccc")
        .attr("stroke", "black")
        // alternatively, can say d => geoGenerator(d)  
        .append("title").text(d => d.properties.name + " " + d.properties.value);
}

svg.call(d3.zoom()
    .extent([[0, 0], [constants.SVG_WIDTH, constants.SVG_HEIGHT]])
    .scaleExtent([1, 8])
    .on("zoom", handleZoom));

function handleZoom(event) {
    chart.attr("transform", event.transform);
}

function getCountryNames(features) {
    return features.map(d => d.properties.name)
}