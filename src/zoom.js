import * as d3 from "d3"

const mapMargin = 100;

let zoom;

export function setupZoom(width, height, pathGenerator) {
    zoom = d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .translateExtent([[-mapMargin, -mapMargin], [width + mapMargin, height + mapMargin]])
        .on("zoom", (event) => handleZoom(event.transform));

    setupResetButton();
    setupRegionsZoom(pathGenerator, width, height);

    return zoom;
}

function handleZoom(transform) {
    console.log(transform)
    d3.select("#chart").attr("transform", transform);
    d3.select("#recentre").attr("hidden", null);
}

function setupResetButton() {
    const button = d3.select("#visualisation")
        .append("button")
        .attr("id", "recentre")
        .style("position", "absolute")
        .style("top", "580px") // these should be changed to some vars
        .style("left", "930px")
        .attr("hidden", "hidden") // hide the button by default, activate after zoom or pan 
        .text("Recentre")
        .on("click", () => resetZoom())
}

function resetZoom() {
    d3.select("#map").call(zoom.transform, d3.zoomIdentity);
    d3.select("#recentre").attr("hidden", "hidden");
}

function setupRegionsZoom(pathGenerator, width, height) {
    const container = d3.select("#regionZoom")
        .style("margin", "10px");

    const tag = container.append("text")
        .text("Zoom to region: ")
        .style("margin-right", "10px");

    const northAmerica = container.append("button")
        .attr("id", "north-america")
        .text("North America")
        .style("margin-right", "10px")
        .on("click", d => zoomToNorthAmerica(pathGenerator, width, height));

    const southAmericas = container.append("button")
        .attr("id", "south-america")
        .text("South America")
        .style("margin-right", "10px")

    const africa = container.append("button")
        .attr("id", "africa")
        .text("Africa")
        .style("margin-right", "10px");

    const europe = container.append("button")
        .attr("id", "europe")
        .text("Europe")
        .style("margin-right", "10px");

    const asia = container.append("button")
        .attr("id", "asia")
        .text("Asia")
        .style("margin-right", "10px");

    const oceania = container.append("button")
        .attr("id", "oceania")
        .text("Oceania")
        .style("margin-right", "10px");
}

function zoomToNorthAmerica(pathGenerator, width, height) {
    const countries = d3.selectAll("path.country");
    const boundingCountries = countries.filter(filterNothAmerica).data(); // data() gets the geoJSON objects 
    const bounds = boundingCountries.map(d => pathGenerator.bounds(d))

    const region = getMaxBounds(bounds, width, height);
    const transform = d3.zoomIdentity.translate(region[1][0], region[1][1]).scale(region[0]);
    handleZoom(transform);
    d3.select("#map").call(zoom);
}

function filterNothAmerica(d) {
    return d.properties.name == "Canada"
        || d.properties.name == "United States of America"
        || d.properties.name == "Panama";
}

function getMaxBounds(allBounds, width, height) {
    const minXBound = d3.min(allBounds.map(d => d[0][0]));
    const minYBound = d3.min(allBounds.map(d => d[0][1]));
    const maxXBound = d3.max(allBounds.map(d => d[1][0]));
    const maxYBound = d3.max(allBounds.map(d => d[1][1]));

    const boxWidth = maxXBound - minXBound;
    const boxHeight = maxYBound - minYBound;
    const x = (minXBound + maxXBound) / 2;
    const y = (minYBound + maxYBound) / 2;

    const scale = .9 / Math.max(boxWidth / width, boxHeight / height);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    return [scale, translate];
}