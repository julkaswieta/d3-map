import { sliderBottom } from "d3-simple-slider";
import { format, max, min, select } from "d3";
import { displayDataset, getOriginalSVGSize } from "./map";
import { getYears } from "./data";
import { getDatasets, getYear, updateYear } from "./main";

const slider = sliderBottom();
let sliderBox;

export function setupSlider() {
    const years = getYears();
    let year = getYear();
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
            updateYear(year);
            const datasets = getDatasets();
            displayDataset(datasets[0]);
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