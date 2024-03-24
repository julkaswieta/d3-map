let datasets = ["production"];

let year = "2019";

export function getYear() {
    return year;
}

export function updateYear(newYear) {
    year = newYear;
}

export function getDatasets() {
    return datasets;
}

export function addDataset(dataset) {
    dataset = dataset.toLowerCase();
    if (datasets.length < 2) {
        for (let i = 0; i < datasets.length; i++)
            if (datasets[i] == dataset)
                return false;
        datasets.push(dataset);
        return true;
    }
    return false;
}

export function removeDataset(dataset) {
    dataset = dataset.toLowerCase();
    datasets = datasets.filter(d => d != dataset);
}