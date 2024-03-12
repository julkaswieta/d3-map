import * as d3 from "d3";
import { sidePanel } from "./extra-text";
import { displayDataset } from "./map";
import { getYear } from "./main";

const panelWidth = 300;

export function setupSidePanel() {
    setupHeader();
    setupButtons();
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
            .attr("class", "metric-choice")
            .on("click", function () {
                displayDataset(buttonLabels[i]);
                changeText(buttonLabels[i])
            });
    }
}

function changeText(metric) {
    const infoText = d3.select("#info-text")
        .style("background-color", "lightgrey");

    infoText.selectChild("h3").text(metric);
    infoText.selectChild("p")
        .text(sidePanel[metric])
}