import * as d3 from "d3";
import { getGeoJson } from "./data";

const mapSize = { width: 800, height: 500 };
// this is what takes the coordinates of the countries borders 
// and translates it onto a 2d plane using different cartographic methods
const projection = d3.geoNaturalEarth1();

// this is creating paths (country shapes) from coordinates using the selected projection
const pathGenerator = d3.geoPath().projection(projection);

export function resizeMap(defaultSize) {
    let width, height;
    if (!defaultSize)
        [width, height] = getCurrentMapSize();
    else {
        width = mapSize.width;
        height = mapSize.height;
    }
    projection.fitExtent([[10, -20], [width - 10, height - 50]], getGeoJson());
}

export function getPathGenerator() {
    return pathGenerator;
}

export function getOriginalSVGSize() {
    return mapSize;
}

export function getCurrentMapSize() {
    const map = d3.select("#visualisation");
    const mapSize = map.node().getBoundingClientRect(); // get size of the map
    const width = mapSize.width;
    const height = mapSize.height;
    return [width, height];
}