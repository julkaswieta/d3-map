import { setupSlider } from "./slider.js";
import { resizeMap, getColor, initialiseMap, displayDataset } from "./map.js";
import { getCountryData, loadAllData } from "./data.js";
import { setupLegend } from "./legend.js";
import { setupZoomButtons } from "./zoom.js";
import { setupSidePanel } from "./side-panel.js";

let year = "2019";
let dataset = "production";

await initialise();

async function initialise() {
    await loadAllData();
    const countryData = getCountryData();
    resizeMap(true);
    initialiseMap(countryData, year);
    displayDataset(dataset, year);
    setupSidePanel();
    setupSlider(year);
    setupZoomButtons();
    setupLegend(getColor());
}

export function reloadData(metric) {
    console.log("Data reload " + metric);
}

export function getGeoJson() {
    return geoJson;
}

export function getDatasetName() {
    return dataset;
}