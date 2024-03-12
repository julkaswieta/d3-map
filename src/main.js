import { setupSlider } from "./slider.js";
import { resizeMap, initialiseMap, displayDatasets } from "./map.js";
import { getCountryData, loadAllData } from "./data.js";
import { setupLegend } from "./legend.js";
import { setupZoomButtons } from "./zoom.js";
import { setupSidePanel } from "./side-panel.js";

let year = "2019";
let datasets = [];

await initialise();

async function initialise() {
    await loadAllData();
    const countryData = getCountryData();
    resizeMap(true);
    initialiseMap(countryData);
    displayDatasets();
    setupSidePanel();
    setupSlider();
    setupZoomButtons();
    setupLegend();
}

export function getDatasets() {
    return datasets;
}

export function getYear() {
    return year;
}

export function addDataset(dataset) {
    dataset = dataset.toLowerCase();
    if (datasets.length < 2) {
        for (let i = 0; i < datasets.length; i++)
            if (datasets[i] == dataset)
                return false;
        datasets.push(dataset);
        return true;
    }
    return false;
}

export function removeDataset(dataset) {
    console.log(datasets)
    datasets = datasets.filter(d => d != dataset);
    console.log(datasets)
}

export function updateYear(newYear) {
    year = newYear;
    console.log(year)
}