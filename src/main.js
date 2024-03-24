"use strict";
import { setupSlider } from "./slider.js";
import { initialiseMap, displayDatasets } from "./map.js";
import { loadAllData } from "./data.js";
import { setupZoomButtons } from "./zoom.js";
import { setupSidePanel } from "./side-panel.js";

await initialise();

async function initialise() {
    await loadAllData();
    initialiseMap();
    displayDatasets();
    setupSidePanel();
    setupSlider();
    setupZoomButtons();
}