import { afterAll, beforeAll, expect, test } from "vitest";
import { colourClass, fillColour } from "../src/map";
import { addDataset, clearDatasets, updateYear } from "../src/datasets";
import { beforeEach } from "vitest";

beforeAll(() => {
    updateYear("2019");
});

beforeEach(() => {
    clearDatasets();
});

const countryMock1 = {
    properties: {
        production: {
            "2019": 10
        }
    }
};

const countryMock2 = {
    properties: {}
};


const countryMock3 = {
    properties: {
        consumption: {
            "2019": 51000000
        }
    }
};

const countryMock4 = {
    properties: {
        export: {
            "2019": 1500000
        }
    }
};

const countryMock5 = {
    properties: {
        import: {
            "2019": 3000000
        },
        consumption: {
            "2019": 25000
        }
    }
};

const year = "2019";


test("colour for producing country with production selected", () => {
    addDataset("production");
    expect(colourClass(countryMock1, year)).toBe("cfff5eb");
    expect(fillColour(countryMock1, year)).toBe("#fff5eb");
});

test("no dataset for the country colour", () => {
    addDataset("production");
    expect(colourClass(countryMock2, year)).toBe("");
    expect(fillColour(countryMock2, year)).toBe("#e8e6e6");
});

test("colour for consuming country with production and consumption selected", () => {
    addDataset("production");
    addDataset("consumption");
    expect(colourClass(countryMock3, year)).toBe("c08306b");
    expect(fillColour(countryMock3, year)).toBe("#08306b");
});


test("colour for exporting country with export selected", () => {
    addDataset("export");
    expect(fillColour(countryMock4, year)).toBe("#fd8d3c");
    expect(colourClass(countryMock4, year)).toBe("cfd8d3c");
});

test("colour for importing country with export and import selected", () => {
    addDataset("export");
    addDataset("import");
    expect(fillColour(countryMock5, year)).toBe("#6baed6");
    expect(colourClass(countryMock5, year)).toBe("c6baed6");
});

test("colour for consuming/importing country with import and consumption selected together", () => {
    addDataset("import");
    addDataset("consumption");
    // since import added as ds1, the colour should be of import
    expect(fillColour(countryMock5, year)).toBe("#6baed6");
    expect(colourClass(countryMock5, year)).toBe("c6baed6");
});

afterAll(() => {
    clearDatasets();
    addDataset("production");
});