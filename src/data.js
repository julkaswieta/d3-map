import { csv, json } from "d3";
import { feature } from "topojson"

let countryData;
let geoJson;
let years;

export function getCountryData() {
    return countryData;
}

export function getGeoJson() {
    return geoJson;
}

export async function loadAllData() {
    await loadGeoJSON();
    await loadData();
}

async function loadGeoJSON() {
    await json("../data/countries-110m.json").then(function (geoData) {
        geoJson = feature(geoData, geoData.objects.countries);
        countryData = geoJson.features;
    });
}

async function loadData() {
    const datasets = ["production", "consumption", "import", "export"];
    for (let i = 0; i < datasets.length; i++) {
        const path = "../data/" + datasets[i] + ".csv";
        await csv(path).then(function (coffeeData) {
            processDataset(coffeeData, countryData, datasets[i]);
        });
    }
}

function processDataset(coffeeData, geoJSON, dataset) {
    // for each coffee country
    for (let i = 0; i < coffeeData.length; i++) {
        let coffeeCountry = coffeeData[i].Country;

        // find a corresponding country in the country outlines
        for (let j = 0; j < geoJSON.length; j++) {
            let geoCountry = geoJSON[j].properties.name;
            if (coffeeCountry == geoCountry) {
                delete coffeeData[i].Country;
                geoJSON[j].properties[dataset] = coffeeData[i];
                years = Object.keys(coffeeData[i]);
                break;
            }
        }
    }
}

export function getYears() {
    return years;
}