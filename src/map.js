import * as d3 from "d3"
import { showTooltip, hideTooltip } from "./tooltip.js"

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 600;

const svg = d3.select("#visualisation").append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT)
    .attr("id", "map");

const chart = svg.append("g").classed("chart", true);

// this is what takes the coordinates of the countries borders and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1();

const pathGenerator = d3.geoPath().projection(projection); // this is creating paths (country shapes) from coordinates using the selected projection

const thresholds = [10000, 100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000];

const color = d3.scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeYlOrBr[9]);

export function resizeMap(geoJson) {
    projection.fitExtent([[10, 0], [SVG_WIDTH - 10, SVG_HEIGHT - 50]], geoJson);
}

export function setupMap(countries, year) {
    const paths = chart.selectAll("path")
        .data(countries) // that's the data points
        .join("path"); // create a new path for each country

    paths.attr("class", (d) => color(d.properties[year]) === undefined ? "" : "c" + color(d.properties[year]).substring(1))
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => color(d.properties[year]) ?? "#e8e6e6")
        .attr("stroke", "darkgray")
        .on("mouseover", function (e, i) {
            showTooltip(i, this, year);
            d3.select(this).raise(); // this line ensures that the stroke of this country stays on top on hover
        })
        .on("mouseout", hideTooltip);

    const zoom = d3.zoom()
        .extent([[0, 0], [SVG_WIDTH, SVG_HEIGHT]])
        .scaleExtent([1, 8])
        .translateExtent([[-100, -100], [SVG_WIDTH + 100, SVG_HEIGHT + 100]])
        .on("zoom", handleZoom);

    svg.call(zoom);

    setupResetButton(zoom);
}

export function getColor() {
    return color;
}

function handleZoom(event) {
    chart.attr("transform", event.transform);
    d3.select("#recentre").attr("hidden", null);
}

function setupResetButton(zoom) {
    const button = d3.select("#visualisation")
        .append("button")
        .attr("id", "recentre")
        .style("position", "absolute")
        .style("top", "580px")
        .style("left", "930px")
        .attr("hidden", "hidden") // hide the button by default, activate after zoom or pan 
        .text("Recentre")
        .on("click", () => resetZoom(zoom))
}

function resetZoom(zoom) {
    svg.call(zoom.transform, d3.zoomIdentity);
    d3.select("#recentre").attr("hidden", "hidden");
}

