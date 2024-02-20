import { csv, json } from "d3";
import { feature } from "topojson"
import { createSlider, slider, sliderBox } from "./slider.js";
import { setupMap, resizeMap } from "./map.js";
import { processCoffeeData } from "./data.js";

let year = "2019";

csv("../data/production.csv").then(function (coffeeData) {
    coffeeData.columns.shift(); // get the columns and remove the first one ("Country")
    let years = coffeeData.columns;
    let yearsNumbers = years.map(year => +year.slice(0, 4)); //get the first part of the year 

    json("../data/countries-110m.json").then(function (geoData) {
        const geoJson = feature(geoData, geoData.objects.countries);
        const countries = geoJson.features;
        // fill up the svg element with the map
        resizeMap(geoJson);
        processCoffeeData(coffeeData, countries);
        // merge the dataset into the geojson as we need a single dataset to bind
        setupMap(coffeeData, countries, year);

        createSlider(yearsNumbers, year)
            .on("onchange", function (val) {
                year = val;
                setupMap(coffeeData, countries, year);
            })

        sliderBox.call(slider);
    })
});