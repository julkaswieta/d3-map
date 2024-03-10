import { sliderBottom } from "d3-simple-slider";
import { format, max, min, select } from "d3";
import { changeYear, getOriginalSVGSize, setupMap } from "./map";

const slider = sliderBottom();
let sliderBox;

export function setupSlider(countries, year) {
    const years = getYears(countries);
    const [width, height] = getOriginalSVGSize();

    sliderBox = select("#slider-container")
        .append("svg")
        .attr("viewBox", [-20, -20, width, 60])
        .attr("width", width)
        .attr("height", 60)
        .attr("style", "max-width: 100%; height: auto")
        .attr("id", "sliderBox");

    slider.min(min(years))
        .max(max(years))
        .tickValues(years)
        .step(1)
        .width(0.95 * width)
        .tickFormat(format("")) // removes the comma in thousands
        .default(year)
        .on("onchange", function (val) {
            year = val;
            changeYear(year);
        })

    sliderBox.call(slider);
    formatTicks();
}

function formatTicks() {
    const ticks = select("g.axis").selectChildren("g.tick").selectChildren("text")
    ticks.each(function () {
        const year = +this.textContent;
        if (year % 5 != 0) {
            select(this).style("visibility", "hidden");
        }
    })
}

function getYears(countries) {
    const brazilProps = Object.keys(countries.filter(d => d.properties.name == "Brazil")[0].properties);
    const italyProps = Object.keys(countries.filter(d => d.properties.name == "Italy")[0].properties);
    if (brazilProps.length > 1) {
        return brazilProps
            .filter(d => d != "name")
            .map(d => +d);
    }
    else {
        return italyProps
            .filter(d => d != "name")
            .map(d => +d);
    }
}