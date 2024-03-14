import { createPopper } from "@popperjs/core";
import { select, format } from "d3";
import { createLineChart } from "./linechart";
import { getDatasets } from "./datasets";
import { getYear } from "./main";

const MARGIN = { top: 20, right: 10, left: 10, bottom: 20 };
const TOOLTIP_WIDTH = 240;
const TOOLTIP_HEIGHT = 155;

const tooltip = document.querySelector("#tooltip");
let popperInstance = null;

let country;
let year;

export function showTooltip(countryData, targetElement) {
    country = countryData;
    year = getYear();
    tooltip.style.visibility = "visible";

    arrangeTooltipElements();

    if (popperInstance)
        popperInstance.destroy();

    createPopperInstance(targetElement);
}

function arrangeTooltipElements() {
    const canvas = select(tooltip);

    const svg = canvas.append("svg")
        .attr("width", TOOLTIP_WIDTH)
        .attr("height", TOOLTIP_HEIGHT)
        .attr("id", "tooltip-container");

    addCountryName();

    const datasets = getDatasets();
    const ds1Exists = country.properties[datasets[0]] !== undefined;
    const ds2Exists = country.properties[datasets[1]] !== undefined;

    addAmounts(datasets, ds1Exists, ds2Exists);

    const lineChart = svg.append("g")
        .attr("id", "linechart-container")
        .attr("transform", `translate(10, 50)`);

    if (ds1Exists || ds2Exists)
        createLineChart(country, year);
}

function addCountryName() {
    const countryName = select("#tooltip-container").append("g")
        .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
        .attr("width", TOOLTIP_WIDTH);

    countryName.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .text(country.properties.name)
        .style("word-wrap", "normal")
        .attr("width", TOOLTIP_WIDTH - MARGIN.left - MARGIN.right)
}

function addAmounts(datasets, ds1Exists, ds2Exists) {
    const amounts = select("#tooltip-container").append("g")
        .attr("transform", `translate(10, 40)`)
        .attr("width", TOOLTIP_WIDTH)
        .attr("id", "amounts");

    const text1 = amounts.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("id", "amount-1")
        .style("word-wrap", "normal")
        .attr("width", TOOLTIP_WIDTH - MARGIN.left - MARGIN.right);

    addAmountText(datasets, ds1Exists, ds2Exists);
}

function addAmountText(datasets, ds1Exists, ds2Exists) {
    const text1 = select("#amount-1");

    if (ds1Exists) {
        displayDatasetAmount(datasets[0], text1, "steelblue");

        if (ds2Exists) {
            const text2 = select("#amounts").append("text")
                .attr("x", 0)
                .attr("y", 20)
                .style("word-wrap", "normal")
                .attr("width", TOOLTIP_WIDTH - MARGIN.left - MARGIN.right);

            displayDatasetAmount(datasets[1], text2, "navy");
        }
    }
    else {
        if (ds2Exists) {
            displayDatasetAmount(datasets[1], text1, "steelblue")
        }
        else {
            text1.text("No data");
            text1.attr("fill", "black");
            select("#tooltip-container").attr("height", 100).attr("width", 200);
        }
    }
}

function displayDatasetAmount(dataset, element, textColour) {
    if (country.properties[dataset][year] !== undefined) {
        const datasetName = convertDatasetName(dataset);
        const datasetAmount = format(",")(country.properties[dataset][year]) + " bags";
        element.text(datasetName + ": " + datasetAmount);
        element.attr("fill", textColour);
    }
    else {
        element.text("No " + dataset + " data");
        element.attr("fill", "black");
    }
}

function convertDatasetName(dataset) {
    return dataset.charAt(0).toUpperCase() + dataset.slice(1);
}

function createPopperInstance(element) {
    popperInstance = createPopper(element, tooltip, {
        placement: "top"
    });
}

export function hideTooltip() {
    tooltip.style.visibility = 'hidden';
    tooltip.innerHTML = ""; // Clean up the previous tooltip displayed
    if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
    }
}