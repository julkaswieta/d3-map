import { createPopper } from "@popperjs/core";
import { select } from "d3";
import { createLineChart } from "./linechart";

const MARGIN = { top: 20, right: 10, left: 10, bottom: 20 };
const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 150;

const tooltip = document.querySelector("#tooltip");
let popperInstance = null;

export function createPopperInstance(element) {
    popperInstance = createPopper(element, tooltip, {
        placement: "top"
    });
}

export function showTooltip(countryData, targetElement, year) {
    tooltip.innerHTML = ""; // Clean up the previous tooltip displayed
    tooltip.style.visibility = "visible";

    const canvas = select(tooltip);

    // Line chart
    const svg = canvas.append("svg")
        .attr("width", TOOLTIP_WIDTH)
        .attr("height", TOOLTIP_HEIGHT)
        .attr("id", "tooltip-container");

    const countryName = svg.append("g")
        .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
        .attr("width", TOOLTIP_WIDTH);

    countryName.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 30)
        .text(countryData.properties.name)
        .style("word-wrap", "normal")
        .attr("width", TOOLTIP_WIDTH - MARGIN.left - MARGIN.right)

    const amount = svg.append("g")
        .attr("transform", `translate(10, 40)`)
        .attr("width", TOOLTIP_WIDTH);

    amount.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 30)
        .text((countryData.properties[year] === undefined) ? "No data" : countryData.properties[year])
        .style("word-wrap", "normal")
        .attr("width", TOOLTIP_WIDTH - MARGIN.left - MARGIN.right);

    const lineChart = svg.append("g")
        .attr("id", "linechart-container")
        .attr("transform", `translate(10, 80)`);

    createLineChart(countryData, year);

    if (popperInstance) {
        popperInstance.destroy();
    }

    createPopperInstance(targetElement);
}

export function hideTooltip() {
    tooltip.style.visibility = 'hidden';
    if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
    }
}