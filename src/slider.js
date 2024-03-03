import { sliderBottom } from "d3-simple-slider";
import { format, max, min, select } from "d3";
import { changeYear, setupMap } from "./map";

const slider = sliderBottom();
let sliderBox;

export function setupSlider(countries, year) {
    const years = getYears(countries);

    slider.min(min(years))
        .max(max(years))
        .tickValues(years)
        .step(1)
        .width(750)
        .tickFormat(format("")) // removes the comma in thousands
        .default(year)
        .on("onchange", function (val) {
            year = val;
            changeYear(year);
        })

    sliderBox = select("#slider-container")
        .append("svg")
        .attr("viewBox", [-20, -20, 800, 60])
        .attr("width", 800)
        .attr("height", 60)
        .attr("style", "max-width: 100%; height: auto");

    sliderBox.call(slider);
}

function getYears(countries) {
    return Object.keys(
        countries.filter(d => d.properties.name == "Brazil")[0].properties)
        .filter(d => d != "name")
        .map(d => +d);
}