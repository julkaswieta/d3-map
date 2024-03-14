import * as d3 from "d3";
import { sidePanel } from "./extra-text";
import { displayDatasets } from "./map";
import { addDataset, getDatasets, removeDataset } from "./datasets";

const panelWidth = 300;

export function setupSidePanel() {
    setupHeader();
    setupButtons();
    const datasets = getDatasets();
    if (getDatasets().length > 0) {
        d3.select("#" + datasets[0]).classed("unclicked", false).classed("clicked", true);
    }
}

function setupHeader() {
    const header = d3.select("#side-panel").append("g")
        .attr("id", "header")

    header.append("h1")
        .text("Coffee production");

    const dataSource = header.append("p")
        .append("a")
        .attr("href", "https://icocoffee.org/")
        .attr("target", "_blank")
        .text("Data source: International Coffee Organisation")

    const info = header.append("h3")
        .text("Please select one or two metrics to be displayed on the map: ")

    d3.select("#side-panel")
        .style("border-style", "solid");
}

function setupButtons() {
    const buttonGroup = d3.select("#side-panel").append("g");
    const infoText = d3.select("#side-panel").append("div").attr("id", "info-text");
    infoText.append("h3");
    infoText.append("p");

    const buttonLabels = ["Production", "Consumption", "Import", "Export"];

    for (let i = 0; i < 4; i++) {
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
    if (button.classed("unclicked")) {
        const canAddNew = addDataset(dataset);
        if (canAddNew) {
            displayDatasets();
            changeText(dataset)
            button.classed("unclicked", false)
            button.classed("clicked", true);
        }
    }
    else {
        removeDataset(dataset);
        displayDatasets();
        button.classed("unclicked", true);
        button.classed("clicked", false);
    }
}

function changeText(metric) {
    const infoText = d3.select("#info-text")
        .style("background-color", "lightgrey");

    infoText.selectChild("h3").text(metric);
    infoText.selectChild("p")
        .text(sidePanel[metric])
}