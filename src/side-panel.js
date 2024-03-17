import * as d3 from "d3";
import { sidePanel } from "./extra-text";
import { displayDatasets } from "./map";
import { addDataset, getDatasets, removeDataset } from "./datasets";
import { library, icon } from "@fortawesome/fontawesome-svg-core";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export function setupSidePanel() {
    setupHeader();
    setupButtons();
    const datasets = getDatasets();
    if (getDatasets().length > 0) {
        d3.select("#" + datasets[0])
            .classed("unclicked", false)
            .classed("clicked", true);
    }
}

function setupHeader() {
    const header = d3.select("#side-panel")
        .append("g")
        .attr("id", "header");

    header.append("h1")
        .text("Coffee production");

    header.append("button")
        .attr("id", "data-source")
        .html(createExternalLinkIcon)
        .append("text")
        .text("Data source: International Coffee Organisation")
        .style("margin-left", "8px")
        .on("click", d => window.open("https://icocoffee.org/", '_blank').focus());

    header.append("h3")
        .text("Please select one or two metrics to be displayed on the map: ");

    d3.select("#side-panel")
        .style("border-style", "solid");
}

function createExternalLinkIcon() {
    library.add(faArrowUpRightFromSquare);
    return icon(faArrowUpRightFromSquare).html;
}

function setupButtons() {
    const buttonGroup = d3.select("#side-panel").append("g");
    const infoText = d3.select("#side-panel")
        .append("div")
        .attr("id", "info-text");
    infoText.append("h3");
    infoText.append("p");

    const buttonLabels = ["Production", "Consumption", "Import", "Export"];

    for (let i = 0; i < buttonLabels.length; i++) {
        buttonGroup.append("button")
            .text(buttonLabels[i])
            .attr("class", "dataset-choice")
            .attr("id", buttonLabels[i].toLowerCase())
            .classed("unclicked", true)
            .on("click", function () {
                datasetOnClick(d3.select(this), buttonLabels[i]);
            });
    }
}

function datasetOnClick(button, dataset) {
    const possibleDatasets = ["production", "consumption", "import", "export"];
    if (button.classed("unclicked")) {
        const canAddNew = addDataset(dataset);
        const datasets = getDatasets();
        if (canAddNew) {
            displayDatasets();
            changeText(dataset);
            button.classed("unclicked", false);
            button.classed("clicked", true);
            if (datasets.length > 1) {
                const unavailable = possibleDatasets.filter(d => !datasets.includes(d));
                unavailable.forEach(d => console.log(d3.select("button#" + d).classed("unavailable", true).attr("title", "Cannot select more than two datasets")));
            }
        }
    }
    else {
        removeDataset(dataset);
        const datasets = getDatasets();
        if (datasets.length <= 1) {
            d3.selectAll("button.dataset-choice").each(function (d) { d3.select(this).classed("unavailable", false).attr("title", null) });
        }
        displayDatasets();
        button.classed("unclicked", true);
        button.classed("clicked", false);
    }
}

function changeText(metric) {
    const infoText = d3.select("#info-text")
        .style("background-color", "lightgrey");

    infoText.selectChild("h3")
        .text(metric);
    infoText.selectChild("p")
        .text(sidePanel[metric]);
}