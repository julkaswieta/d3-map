import * as d3 from "d3"
import { getMapWidthHeight, getOriginalSVGSize, resizeMap } from "./map";
import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const mapMargin = 100;

let zoom;
let zoomedRegion = null;
let recentreGroup;

export function setupZoom(width, height, pathGenerator) {
    zoom = d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .translateExtent([[-mapMargin, -mapMargin], [width + mapMargin, height + mapMargin]])
        .on("zoom", (event) => handleZoom(event.transform));

    setupResetButton();
    setupRegionsZoom(pathGenerator);

    return zoom;
}

function handleZoom(transform) {
    d3.select("#map").attr("transform", transform);
}

function setupResetButton() {
    const buttonSize = 25;
    const margin = 5;

    const [width, height] = getOriginalSVGSize();

    recentreGroup = d3.select("#visualisation")
        .append("g")
        .attr("id", "recentre");

    recentreGroup.append("circle")
        .attr("r", buttonSize)
        .attr("cx", width - buttonSize - margin)
        .attr("cy", height - buttonSize - margin)
        .attr("fill", "lightgrey")
        .attr("stroke", "darkgray")
        .on("click", () => resetZoom());

    recentreGroup.append("svg")
        .html(createRecentreIcon())
        .attr("x", width / 2 - buttonSize - margin)
        .attr("y", height / 2 - buttonSize - margin);
}

function createRecentreIcon() {
    library.add(faRotateRight);
    return icon(faRotateRight, {
        transform:
            { size: 1 }
    }).html;
}

function resetZoom() {
    d3.select("#visualisation").transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    zoomedRegion = null;
}

function setupRegionsZoom(pathGenerator) {
    const container = d3.select("#regionZoom")
        .style("margin", "10px");

    const tag = container.append("text")
        .text("Zoom to region: ")
        .style("margin-right", "10px");

    const northAmerica = container.append("button")
        .attr("id", "north-america")
        .text("North America")
        .style("margin-right", "10px")
        .on("click", d => zoomToContinent("northAmerica", pathGenerator));

    const southAmerica = container.append("button")
        .attr("id", "south-america")
        .text("South America")
        .style("margin-right", "10px")
        .on("click", d => zoomToContinent("southAmerica", pathGenerator));

    const africa = container.append("button")
        .attr("id", "africa")
        .text("Africa")
        .style("margin-right", "10px")
        .on("click", d => zoomToContinent("africa", pathGenerator));

    const europe = container.append("button")
        .attr("id", "europe")
        .text("Europe")
        .style("margin-right", "10px")
        .on("click", d => zoomToContinent("europe", pathGenerator));

    const asia = container.append("button")
        .attr("id", "asia")
        .text("Asia")
        .style("margin-right", "10px")
        .on("click", d => zoomToContinent("asia", pathGenerator));

    const oceania = container.append("button")
        .attr("id", "oceania")
        .text("Oceania")
        .style("margin-right", "10px")
        .on("click", d => zoomToContinent("oceania", pathGenerator));
}

function zoomToContinent(continent, pathGenerator) {
    if (zoomedRegion != continent) {
        zoomedRegion = continent;
        resizeMap(); // this ensures that the zoom to region works when the window is resized 
        const countries = d3.selectAll("path.country");
        const boundingCountries = countries.filter(filters[continent]).data(); // data() gets the geoJSON objects 
        const bounds = boundingCountries.map(d => pathGenerator.bounds(d));

        const [scale, translate] = calculateTransform(bounds);
        const transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        d3.select("#visualisation").transition().duration(750).call(zoom.transform, transform);
    }
    else
        resetZoom();
}

const filters = {
    northAmerica:
        (d) => d.properties.name == "Canada"
            || d.properties.name == "United States of America"
            || d.properties.name == "Panama",

    southAmerica:
        (d) => d.properties.name == "Colombia"
            || d.properties.name == "Chile"
            || d.properties.name == "Peru"
            || d.properties.name == "Brazil",

    africa:
        (d) => d.properties.name == "Algeria"
            || d.properties.name == "Senegal"
            || d.properties.name == "Somalia"
            || d.properties.name == "South Africa",

    europe:
        (d) => d.properties.name == "Norway"
            || d.properties.name == "Portugal"
            || d.properties.name == "Greece"
            || d.properties.name == "Ukraine",

    oceania:
        (d) => d.properties.name == "Indonesia"
            || d.properties.name == "Vanuatu"
            || d.properties.name == "New Zealand",

    asia:
        (d) => d.properties.name == "Finland"
            || d.properties.name == "Malaysia"
            || d.properties.name == "Japan"
}

function calculateTransform(allBounds) {
    const margin = 20;
    const minXBound = d3.min(allBounds.map(d => d[0][0])) - margin;
    const minYBound = d3.min(allBounds.map(d => d[0][1])) - margin;
    const maxXBound = d3.max(allBounds.map(d => d[1][0])) + margin;
    const maxYBound = d3.max(allBounds.map(d => d[1][1])) + margin;

    const boxWidth = maxXBound - minXBound;
    const boxHeight = maxYBound - minYBound;
    const x = (minXBound + maxXBound) / 2;
    const y = (minYBound + maxYBound) / 2;

    let [width, height] = getMapWidthHeight();
    height = height * 0.8;

    const scale = .9 / Math.max(boxWidth / width, boxHeight / height);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    return [scale, translate];
}