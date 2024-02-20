export function processCoffeeData(coffeeData, countries) {
    // for each coffee country
    for (let i = 0; i < coffeeData.length; i++) {
        let coffeeCountry = coffeeData[i].Country;

        // find a corresponding country in the country outlines
        for (let j = 0; j < countries.length; j++) {
            let geoCountry = countries[j].properties.name;
            if (coffeeCountry == geoCountry) {
                let yearData = cleanYearValues(coffeeData[i]);
                // assign values for all years to the country outline
                for (let k = 0; k < yearData.length; k++) {
                    countries[j].properties[yearData[k].year] = yearData[k].value;
                }
                break;
            }
        }
    }
}

function cleanYearValues(yearData) {
    delete yearData.Country;
    const columns = Object.keys(yearData).map(year => ({
        year: year,
        value: parseFloat(yearData[year].replace(",", "")) // Convert string to float and handle commas
    }));
    return columns;
}