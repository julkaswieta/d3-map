import { csv, json } from "d3";
import { feature } from "topojson"
import { setupSlider } from "./slider.js";
import { setupMap, resizeMap, getColor, initEmptyMap } from "./map.js";
import { processCoffeeData } from "./data.js";
import { setupLegend } from "./legend.js";
import { setupZoomButtons } from "./zoom.js";
import { setupSidePanel } from "./side-panel.js";

let year = "2019";
let geoJson;

initialiseMap();

async function initialiseMap() {
    await loadGeoJSON();
    setupSidePanel();
    await addData("production");
}

async function loadGeoJSON() {
    json("../data/countries-110m.json").then(function (geoData) {
        geoJson = feature(geoData, geoData.objects.countries);
        const countries = geoJson.features;
        // fill up the svg element with the map
        resizeMap(true);
        initEmptyMap(countries);
    });
}

async function addData(dataset) {
    const path = "../data/" + dataset.toLowerCase() + ".csv";
    csv(path).then(function (coffeeData) {
        const countries = geoJson.features;
        // merge the dataset into the geojson as we need a single dataset to bind
        processCoffeeData(coffeeData, countries);
        setupMap(countries, year);
        setupZoomButtons();
        setupLegend(getColor());
        setupSlider(countries, year);
    });
}

export function reloadData(metric) {
    console.log("Data reload " + metric);
}

export function getGeoJson() {
    return geoJson;
}