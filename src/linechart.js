import * as d3 from "d3"

export function createLineChart(
    countryData,
    year, {
        width = 120,
        height = 80
    } = {}) {

    const svg = d3.select("#linechart-container");

    const chart = svg.append("svg")
        .attr("width", width)
        .attr("height", height)

    const text = svg.append("text")
        .text("linechart");

    //const xScale = d3.scaleUtc(d3.extent)
}