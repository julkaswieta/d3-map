import { csv, json, select } from "d3";
import { feature } from "topojson"
import { setupSlider } from "./slider.js";
import { setupMap, resizeMap, getColor } from "./map.js";
import { processCoffeeData } from "./data.js";
import { setupLegend } from "./legend.js";
import { setupZoomButtons } from "./zoom.js";

let year = "2019";
let geoJson;

const visualisation = select("#visualisation-container")
    .append("svg")
    .attr("height", 500)
    .attr("width", 800)
    .attr("viewBox", `0 0 800 500`)
    .attr("style", "max-width: 100%; height: auto")
    .attr("id", "visualisation");

csv("../data/production.csv").then(function (coffeeData) {
    json("../data/countries-110m.json").then(function (geoData) {
        geoJson = feature(geoData, geoData.objects.countries);
        const countries = geoJson.features;
        // fill up the svg element with the map
        resizeMap(true);
        // merge the dataset into the geojson as we need a single dataset to bind
        processCoffeeData(coffeeData, countries);
        setupMap(countries, year);
        setupZoomButtons();
        setupLegend(getColor());
        setupSlider(countries, year);
    })
});

export function getGeoJson() {
    return geoJson;
}