import { sliderBottom } from "d3-simple-slider";
import { format, max, min, select } from "d3";

export const slider = sliderBottom();

export const sliderBox = select('#slider')
    .append('svg')
    .attr('width', 1100)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

export function createSlider(yearsNumbers, year) {
    return slider.min(min(yearsNumbers))
        .max(max(yearsNumbers))
        .tickValues(yearsNumbers)
        .step(1)
        .width(1000)
        .tickFormat(format("")) // removes the comma in thousands
        .displayValue(true)
        .default(year);
}