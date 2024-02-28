import * as d3 from "d3"

const mapMargin = 100;

let zoom;
let zoomedRegion = null;

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
    d3.select("#chart").attr("transform", transform);
    d3.select("#recentre").attr("hidden", null);
}

function setupResetButton() {
    d3.select("#visualisation")
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
        const countries = d3.selectAll("path.country");
        const boundingCountries = countries.filter(filters[continent]).data(); // data() gets the geoJSON objects 
        const bounds = boundingCountries.map(d => pathGenerator.bounds(d))

        const map = d3.select("#map").node().getBoundingClientRect(); // get size of the map
        const width = map.width;
        const height = map.height;

        const [scale, translate] = calculateTransform(bounds, width, height);
        const transform = new d3.ZoomTransform(scale, translate[0], translate[1]);
        d3.select("#chart").transition().duration(750).attr("transform", transform);
        d3.select("#recentre").attr("hidden", null);
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

function calculateTransform(allBounds, width, height) {
    const margin = 20;
    const minXBound = d3.min(allBounds.map(d => d[0][0])) - margin;
    const minYBound = d3.min(allBounds.map(d => d[0][1])) - margin;
    const maxXBound = d3.max(allBounds.map(d => d[1][0])) + margin;
    const maxYBound = d3.max(allBounds.map(d => d[1][1])) + margin;

    const boxWidth = maxXBound - minXBound;
    const boxHeight = maxYBound - minYBound;
    const x = (minXBound + maxXBound) / 2;
    const y = (minYBound + maxYBound) / 2;

    const scale = .9 / Math.max(boxWidth / width, boxHeight / height);
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    return [scale, translate];
}