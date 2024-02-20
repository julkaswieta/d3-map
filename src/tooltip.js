import { createPopper } from "@popperjs/core";
import { select } from "d3";

const tooltip = document.querySelector("#tooltip");
let popperInstance = null;

export function createPopperInstance(element) {
    popperInstance = createPopper(element, tooltip, {
        placement: "top"
    });
}

export function showTooltip(countryData, targetElement) {
    tooltip.innerHTML = ""; // Clean up the previous tooltip displayed
    tooltip.style.visibility = "visible";

    const canvas = select(tooltip);

    // Line chart
    const svg = canvas.append("svg")
        .attr("width", 200)
        .attr("height", 100)
        .style("border-style", "solid")
        .style("border-color", "black");

    svg.append("rect")
        .attr("width", 50)
        .attr("height", 50)
        .style("fill", "red");

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