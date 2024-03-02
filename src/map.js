import * as d3 from "d3"
import { showTooltip, hideTooltip } from "./tooltip.js"
import { setupZoom } from "./zoom.js";
import { getGeoJson } from "./main.js";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 500;

const thresholds = [10000, 100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000];

const color = d3.scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeYlOrBr[9]);

// this is what takes the coordinates of the countries borders and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1();

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

export function setupMap(countries, year) {
    const chart = d3.select("#visualisation").append("g").attr("id", "map");

    const pathGenerator = d3.geoPath().projection(projection); // this is creating paths (country shapes) from coordinates using the selected projection

    const paths = chart.selectAll("path")
        .data(countries) // that's the data points
        .join("path"); // create a new path for each country

    paths.attr("class", (d) => color(d.properties[year]) === undefined ? "" : "c" + color(d.properties[year]).substring(1))
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => color(d.properties[year]) ?? "#e8e6e6")
        .attr("name", d => d.properties.name)
        .attr("stroke", "darkgray")
        .on("mouseover", function (e, i) {
            showTooltip(i, this, year);
            d3.select(this).raise(); // this line ensures that the stroke of this country stays on top on hover
        })
        .on("mouseout", hideTooltip);

    const zoom = setupZoom(SVG_WIDTH, SVG_HEIGHT, pathGenerator);

    d3.select("#visualisation").call(zoom);
}

export function getColor() {
    return color;
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

