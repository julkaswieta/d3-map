import * as d3 from "d3"
import { setupLegend } from "./legend.js"
import { showTooltip, hideTooltip } from "./tooltip.js"

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 600;

const svg = d3.select("#visualisation").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT);

const chart = svg.append("g").classed("chart", true);

// this is what takes the coordinates of the countries borders and translates it onto a 2d plane using different cartographic methods
export const projection = d3.geoNaturalEarth1();

const pathGenerator = d3.geoPath().projection(projection); // this is creating paths (country shapes) from coordinates using the selected projection

export function resizeMap(geoJson) {
    projection.fitExtent([[0, 0], [SVG_WIDTH, SVG_HEIGHT]], geoJson);
}

export function setupMap(coffeeData, countries, year) {
    const color = d3.scaleQuantize([
        d3.min(coffeeData, d => +d[year]),
        d3.max(coffeeData, d => +d[year])
    ], d3.schemeGreens[9]);

    setupLegend(color);

    const paths = chart.selectAll("path")
        .data(countries) // that's the data points
        .join("path"); // create a new path for each country

    paths.attr("class", (d) => color(d.properties[year]) === undefined ? "" : "c" + color(d.properties[year]).substring(1))
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => color(d.properties[year]) ?? "#ccc")
        .attr("stroke", "black")
        //.append("title").text(d => d.properties.name + " " + d.properties[year]) // TODO: needs changed
        .on("mouseover", function (e, i) {
            showTooltip(i, this);
        })
        .on("mouseout", hideTooltip);

}
svg.call(d3.zoom()
    .extent([[0, 0], [SVG_WIDTH, SVG_HEIGHT]])
    .scaleExtent([1, 8])
    .on("zoom", handleZoom));

function handleZoom(event) {
    chart.attr("transform", event.transform);
}