import * as d3 from "d3";
import { showTooltip, hideTooltip } from "./tooltip.js";
import { setupZoom } from "./zoom.js";
import { getCountryData, getGeoJson } from "./data.js";
import { getYear } from "./main.js";
import { getDatasets } from "./datasets.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;

const thresholds = [10000, 100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000];

const color = d3.scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeYlOrBr[9]);

// this is what takes the coordinates of the countries borders 
// and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1();

// this is creating paths (country shapes) from coordinates using the selected projection
const pathGenerator = d3.geoPath().projection(projection);

export function resizeMap(defaultSize) {
    let width, height;
    if (!defaultSize)
        [width, height] = getMapWidthHeight();
    else {
        width = SVG_WIDTH;
        height = SVG_HEIGHT;
    }
    projection.fitExtent([[10, 0], [width - 10, height - 50]], getGeoJson());
}

export function initialiseMap() {
    const countries = getCountryData();
    setupContainer();

    const chart = d3.select("#visualisation")
        .append("g")
        .attr("id", "map");

    chart.selectAll("path")
        .data(countries) // that's the data points
        .join("path") // create a new path for each country
        .attr("d", pathGenerator); // that's the actual coordinates of the path

    setupZoom();
}

export function displayDatasets() {
    const year = getYear();
    const paths = d3.select("#map").selectChildren("path");

    paths.attr("class", d => colourClass(d, year))
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => fillColour(d, year))
        .attr("name", d => d.properties.name)
        .attr("stroke", "darkgray")
        .on("mouseover", function (e, i) {
            showTooltip(i, this);
            d3.select(this).raise(); // ensures stroke of this country stays on top on hover
        })
        .on("mouseout", hideTooltip);
}

function fillColour(d, year) {
    const datasets = getDatasets();
    if (d.properties[datasets[0]] !== undefined)
        return color(d.properties[datasets[0]][year]);
    else if (d.properties[datasets[1]] !== undefined)
        return color(d.properties[datasets[1]][year]);
    else
        return "#e8e6e6";
}

function colourClass(d, year) {
    const datasets = getDatasets();
    if (d.properties[datasets[0]] !== undefined)
        return "c" + color(d.properties[datasets[0]][year]).substring(1);
    else if (d.properties[datasets[1]] !== undefined)
        return "c" + color(d.properties[datasets[1]][year]).substring(1);
    else
        return "";
}

function setupContainer() {
    d3.select("#visualisation-container")
        .append("svg")
        .attr("height", SVG_HEIGHT)
        .attr("width", SVG_WIDTH)
        .attr("viewBox", `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`)
        .attr("style", "max-width: 100%; height: auto")
        .attr("id", "visualisation");
}

export function getColor() {
    return color;
}

export function getPathGenerator() {
    return pathGenerator;
}

export function getOriginalSVGSize() {
    return [SVG_WIDTH, SVG_HEIGHT];
}

export function getMapWidthHeight() {
    const map = d3.select("#visualisation");
    const mapSize = map.node().getBoundingClientRect(); // get size of the map
    const width = mapSize.width;
    const height = mapSize.height;
    return [width, height];
}

