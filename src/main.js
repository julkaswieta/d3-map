"use strict";
import { setupSlider } from "./slider.js";
import { resizeMap, initialiseMap, displayDatasets } from "./map.js";
import { loadAllData } from "./data.js";
import { setupZoomButtons } from "./zoom.js";
import { setupSidePanel } from "./side-panel.js";

let year = "2019";

await initialise();

async function initialise() {
    await loadAllData();
    resizeMap(true);
    initialiseMap();
    displayDatasets();
    setupSidePanel();
    setupSlider();
    setupZoomButtons();
}

export function getYear() {
    return year;
}

export function updateYear(newYear) {
    year = newYear;
}