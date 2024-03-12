import * as d3 from "d3"
import { getDatasets } from "./main";

export function createLineChart(
    countryData,
    year, {
        width = 190,
        height = 100,
    } = {}) {

    const margin = { left: 10, right: 20, top: 20, bottom: 20 };

    const svg = d3.select("#linechart-container");

    const chart = svg.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    const dataset = getDatasets();

    const years = extractYears(countryData, dataset);
    const values = extractValues(countryData, dataset);

    const yearValues = cleanYearValues(years, values);

    const xScale = d3.scaleLinear([d3.min(years), d3.max(years)], [margin.left, width - margin.right]);
    const yScale = d3.scaleLinear([0, d3.max(values)], [height - margin.bottom, margin.top]);

    const lineGen = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value));

    chart.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickValues([1990, 2019]).tickFormat(d => (d == 2019 | d == 1990) ? d : ""));

    chart.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(0));

    chart.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineGen(yearValues));

    const dataPoint = yearValues.filter(d => d.year == year)[0];

    chart.append("circle")
        .attr("fill", "red")
        .attr("cx", xScale(dataPoint.year))
        .attr("cy", yScale(dataPoint.value))
        .attr("r", 3);
}

function cleanYearValues(years, values) {
    return years.map(function (x, i) {
        return { year: x, value: values[i] };
    });
}

function extractYears(countryData, dataset) {
    const props = { ...countryData.properties[dataset] };
    delete props.name;
    const years = Object.keys(props).map(d => +d);
    return years;
}

function extractValues(countryData, dataset) {
    const props = { ...countryData.properties[dataset] };
    delete props.name;
    const values = Object.values(props).map(d => +d);
    return values;
}