import * as d3 from "d3";
import { getDatasets, getYear } from "./datasets";

let year;
let lineGen;
let xScale;
let yScale;

export function createLineChart(countryData) {
    year = getYear();
    const country = countryData;

    const datasets = getDatasets();
    const ds1Exists = country.properties[datasets[0]] !== undefined;
    const ds2Exists = country.properties[datasets[1]] !== undefined;

    initLineChart(ds1Exists, ds2Exists, country);

    if (ds1Exists) {
        const color = (datasets[0] == "consumption" || datasets[0] == "import")
            ? "steelblue"
            : "#f16913";
        addDatasetToChart(datasets[0], color, country);
    }
    if (ds2Exists) {
        const color = (datasets[1] == "consumption" || datasets[1] == "import")
            ? "navy"
            : "#7f2704";
        addDatasetToChart(datasets[1], color, country);
    }
}

function initLineChart(ds1Exists, ds2Exists, country) {
    const margin = { left: 10, right: 20, top: 20, bottom: 20 };
    const [width, height] = [220, 100];

    const minMaxValues = getMinMax(ds1Exists, ds2Exists, country);

    const svg = d3.select("#linechart-container");

    const chart = svg.append("svg")
        .attr("id", "linechart")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    xScale = d3.scaleLinear([minMaxValues.minYear, minMaxValues.maxYear],
        [margin.left, width - margin.right]);
    yScale = d3.scaleLinear([0, minMaxValues.maxValue],
        [height - margin.bottom, margin.top]);

    chart.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
            .tickValues([minMaxValues.minYear, minMaxValues.maxYear])
            .tickFormat(d => (d == minMaxValues.maxYear | d == minMaxValues.minYear) ? d : ""));

    chart.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(0));

    lineGen = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value));
}

export function getMinMax(ds1Exists, ds2Exists, country) {
    const datasets = getDatasets();
    let d1 = getDatasetMinMax(datasets[0], country);
    let d2 = getDatasetMinMax(datasets[1], country);

    if (ds1Exists && ds2Exists)
        return compareMinMaxValues(d1, d2);
    else
        return (d1.minYear != undefined && !isNaN(d1.minYear)) ? d1 : d2;
}

export function getDatasetMinMax(dataset, country) {
    const years = extractYears(dataset, country);
    const values = extractValues(dataset, country);
    return {
        minYear: d3.min(years),
        maxYear: d3.max(years),
        maxValue: d3.max(values)
    };
}

export function extractYears(dataset, country) {
    const props = { ...country.properties[dataset] };
    delete props.name;
    const years = Object.keys(props).map(d => +d);
    return years;
}

export function extractValues(dataset, country) {
    const props = { ...country.properties[dataset] };
    delete props.name;
    const values = Object.values(props).map(d => +d);
    return values;
}

export function compareMinMaxValues(set1, set2) {
    const minY = set1.minYear < set2.minYear
        ? set1.minYear
        : (set2.minYear == undefined ? set1.minYear : set2.minYear);
    const maxY = set1.maxYear > set2.maxYear
        ? set1.maxYear
        : (set2.maxYear == undefined ? set1.maxYear : set2.maxYear);
    const maxV = set1.maxValue > set2.maxValue
        ? set1.maxValue
        : (set2.maxValue == undefined ? set1.maxValue : set2.maxValue);

    return {
        minYear: minY,
        maxYear: maxY,
        maxValue: maxV
    };
}

function addDatasetToChart(dataset, strokeColour, country) {
    const years = extractYears(dataset, country);
    const values = extractValues(dataset, country);
    const yearValues = combineYearsValues(years, values);

    d3.select("#linechart")
        .append("path")
        .attr("fill", "none")
        .attr("stroke", strokeColour)
        .attr("stroke-width", 1.5)
        .attr("d", lineGen(yearValues));

    addDataPoint(yearValues);
    return d3.max(values);
}

export function combineYearsValues(years, values) {
    return years.map(function (x, i) {
        return {
            year: x,
            value: values[i]
        };
    });
}

function addDataPoint(yearValues) {
    const dataPoint = yearValues.filter(d => d.year == year)[0];

    d3.select("#linechart")
        .append("circle")
        .attr("fill", "black")
        .attr("cx", xScale(dataPoint.year))
        .attr("cy", yScale(dataPoint.value))
        .attr("r", 2.5);
}