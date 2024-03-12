import { setupSlider } from "./slider.js";
import { resizeMap, getColor, initialiseMap, displayDataset } from "./map.js";
import { getCountryData, loadAllData } from "./data.js";
import { setupLegend } from "./legend.js";
import { setupZoomButtons } from "./zoom.js";
import { setupSidePanel } from "./side-panel.js";

let year = "2019";
let datasets = ["production"];

await initialise();

async function initialise() {
    await loadAllData();
    const countryData = getCountryData();
    resizeMap(true);
    initialiseMap(countryData, year);
    displayDataset(datasets[0]);
    setupSidePanel();
    setupSlider();
    setupZoomButtons();
    setupLegend(getColor());
}

export function reloadData(metric) {
    console.log("Data reload " + metric);
}

export function getDatasets() {
    return datasets;
}

export function getYear() {
    return year;
}

export function updateDatasets(dataset) {
    if (datasets.length < 2) {
        for (let i = 0; i < datasets.length; i++)
            if (datasets[i] == dataset)
                return;
        datasets.push(dataset);
    }
}

export function updateYear(newYear) {
    year = newYear;
    console.log(year)
}