import * as d3 from "d3";
import { getDatasets } from "./datasets";

const LEGEND_WIDTH = 500;

export function updateLegend(mapSize, color, color2) {
    const datasets = getDatasets();
    const producers = datasets.filter(d => d == "production" || d == "export");
    const consumers = datasets.filter(d => d == "consumption" || d == "import");
    const height = mapSize.height;
    if (producers.length > 0) {
        const title = "Coffee "
            + (producers[0] == "production" ? "produced" : "exported")
            + " (in 60kg bags)";
        d3.select("#producers-legend").remove();
        constructLegend(color,
            height * 0.88,
            title,
            true,
            "~s",
            "producers-legend",
            "visible");
    }
    else
        d3.select("#producers-legend").remove();

    if (consumers.length > 0) {
        const title = "Coffee "
            + (consumers[0] == "consumption" ? "consumed" : "imported")
            + " (in 60kg bags)";
        if (producers.length > 0) {
            d3.select("#consumers-legend").remove();
            constructLegend(color2,
                height * 0.8,
                title,
                false,
                null,
                "consumers-legend",
                "visible");
        }
        else {
            d3.select("#consumers-legend").remove();
            constructLegend(color2,
                height * 0.88,
                title,
                true,
                "~s",
                "consumers-legend",
                "visible");
        }
    }
    else
        d3.select("#consumers-legend").remove();
}

function constructLegend(color, y, titleText, displayTicks, formatOfTicks, id, visibility) {
    d3.select("#visualisation").append(() => Legend(
        color,
        {
            title: titleText,
            width: LEGEND_WIDTH,
            displayValues: displayTicks,
            tickFormat: formatOfTicks
        }))
        .attr("x", 10)
        .attr("y", y)
        .attr("id", id)
        .attr("visibility", visibility);
}

// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
function Legend(color, {
    title,
    tickSize = 6,
    width = 320,
    height = 52 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues,
    displayValues = true
} = {}) {

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("id", "legend")
        .style("overflow", "visible");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;

    // Threshold
    if (color.invertExtent) {
        const thresholds
            = color.thresholds ? color.thresholds() // scaleQuantize
                : color.quantiles ? color.quantiles() // scaleQuantile
                    : color.domain(); // scaleThreshold

        const thresholdFormat
            = tickFormat === undefined ? d => d
                : typeof tickFormat === "string" ? d3.format(tickFormat)
                    : tickFormat;

        x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

        svg.append("g")
            .classed("bins", true)
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d)
            // event handlers added by me
            .on("click", function (d, i) {
                const currentBin = d3.select(this);
                const producersLegend = d3.select("#producers-legend")
                    .selectChild("g.bins")
                    .selectChildren();
                const consumersLegend = d3.select("#consumers-legend")
                    .selectChild("g.bins")
                    .selectChildren();

                if (currentBin.classed("selected") == false) {
                    d3.selectAll("path.country").attr("stroke", "darkgrey"); //uncolour countries
                    d3.selectAll("path.c" + i.substring(1)).attr("stroke", "black").raise();
                    currentBin.style("stroke", "black");
                    currentBin.classed("selected", true);
                    producersLegend.each(function () {
                        const bin = d3.select(this);
                        if (bin.node() != currentBin.node()) {
                            bin.style("stroke", "none");
                            bin.classed("selected", false);
                        }
                    });
                    consumersLegend.each(function () {
                        const bin = d3.select(this);
                        if (bin.node() != currentBin.node()) {
                            bin.style("stroke", "none");
                            bin.classed("selected", false);
                        }
                    });
                    d3.select();
                }
                else {
                    d3.selectAll("path.c" + i.substring(1)).attr("stroke", "darkgrey");
                    currentBin.classed("selected", false);
                }
            })
            .on("mouseenter", function () {
                const currentBin = d3.select(this);
                if (currentBin.classed("selected") == false)
                    currentBin.style("stroke", "black");
                else
                    currentBin.style("stroke", "none");
            })
            .on("mouseleave", function () {
                const currentBin = d3.select(this);
                if (currentBin.classed("selected") == false)
                    currentBin.style("stroke", "none");
                else
                    currentBin.style("stroke", "black");
            });

        tickValues = d3.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);
    }

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(displayValues
            ? d3.axisBottom(x)
                .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
                .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
                .tickSize(tickSize)
                .tickValues(tickValues)
            : d3.axisBottom(x)
                .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
                .tickFormat(() => ""))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("class", "title")
            .text(title));

    return svg.node();
}