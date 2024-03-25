import * as d3 from "d3";
import { showTooltip, hideTooltip } from "./tooltip.js";
import { setupZoom } from "./zoom.js";
import { getCountryData } from "./data.js";
import { getDatasets, getYear } from "./datasets.js";
import { updateLegend } from "./legend.js";
import { getOriginalSVGSize, getPathGenerator, resizeMap } from "./projection.js";

const thresholds = [10000, 100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000];

const color = d3.scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeOranges[9]);

const color2 = d3.scaleThreshold()
    .domain(thresholds)
    .range(d3.schemeBlues[9]);

let pathGenerator;
let mapSize;

export function initialiseMap() {
    pathGenerator = getPathGenerator();
    mapSize = getOriginalSVGSize();

    const countries = getCountryData();
    setupContainer();
    resizeMap(true);

    const chart = d3.select("#visualisation")
        .append("g")
        .attr("id", "map");

    chart.selectAll("path")
        .data(countries) // that's the data points
        .join("path") // create a new path for each country
        .attr("d", pathGenerator); // that's the actual coordinates of the path

    setupZoom(mapSize);
}

function setupContainer() {
    d3.select("#visualisation-container")
        .append("svg")
        .attr("height", mapSize.height)
        .attr("width", mapSize.width)
        .attr("viewBox", `0 0 ${mapSize.width} ${mapSize.height}`)
        .attr("style", "max-width: 100%; height: auto")
        .attr("id", "visualisation");
}

export function displayDatasets() {
    const year = getYear();
    const paths = d3.select("#map").selectChildren("path");

    paths.attr("class", d => colourClass(d, year))
        .classed("country", true)
        .attr("d", pathGenerator) // that's the actual coordinates of the path 
        .attr("fill", d => fillColour(d, year))
        .attr("name", d => d.properties.name)
        .attr("stroke", "darkgrey")
        .on("mouseover", function (e, i) {
            showTooltip(i, this);
            d3.select(this).raise(); // ensures stroke of this country stays on top on hover
        })
        .on("mouseout", hideTooltip);

    updateLegend(mapSize, color, color2);
}

export function colourClass(d, year) {
    const datasets = getDatasets();
    const d1Exists = d.properties[datasets[0]] !== undefined;
    const d2Exists = d.properties[datasets[1]] !== undefined;

    if (d1Exists && (datasets[0] == "production" || datasets[0] == "export"))
        return "c" + color(d.properties[datasets[0]][year]).substring(1);
    else if (d2Exists && (datasets[1] == "production" || datasets[1] == "export"))
        return "c" + color(d.properties[datasets[1]][year]).substring(1);
    else if (d1Exists && (datasets[0] == "consumption" || datasets[0] == "import"))
        return "c" + color2(d.properties[datasets[0]][year]).substring(1);
    else if (d2Exists && (datasets[1] == "consumption" || datasets[1] == "import"))
        return "c" + color2(d.properties[datasets[1]][year]).substring(1);
    else
        return "";
}

export function fillColour(d, year) {
    const datasets = getDatasets();
    const d1Exists = d.properties[datasets[0]] !== undefined;
    const d2Exists = d.properties[datasets[1]] !== undefined;

    if (d1Exists && (datasets[0] == "production" || datasets[0] == "export"))
        return color(d.properties[datasets[0]][year]);
    else if (d2Exists && (datasets[1] == "production" || datasets[1] == "export"))
        return color(d.properties[datasets[1]][year]);
    else if (d1Exists && (datasets[0] == "consumption" || datasets[0] == "import"))
        return color2(d.properties[datasets[0]][year]);
    else if (d2Exists && (datasets[1] == "consumption" || datasets[1] == "import"))
        return color2(d.properties[datasets[1]][year]);
    else
        return "#e8e6e6";
}