import * as d3 from "d3"

const mapMargin = 100;

export function setupZoom(width, height) {
    const zoom = d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .translateExtent([[-mapMargin, -mapMargin], [width + mapMargin, height + mapMargin]])
        .on("zoom", handleZoom);

    setupResetButton(zoom);

    return zoom;
}

function handleZoom(event) {
    d3.select("#chart").attr("transform", event.transform);
    d3.select("#recentre").attr("hidden", null);
}

function setupResetButton(zoom) {
    const button = d3.select("#visualisation")
        .append("button")
        .attr("id", "recentre")
        .style("position", "absolute")
        .style("top", "580px") // these should be changed to some vars
        .style("left", "930px")
        .attr("hidden", "hidden") // hide the button by default, activate after zoom or pan 
        .text("Recentre")
        .on("click", () => resetZoom(zoom))
}

function resetZoom(zoom) {
    d3.select("#map").call(zoom.transform, d3.zoomIdentity);
    d3.select("#recentre").attr("hidden", "hidden");
}