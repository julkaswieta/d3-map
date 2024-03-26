import { test, expect, describe, beforeEach } from "vitest";
import {
    combineYearsValues,
    compareMinMaxValues,
    extractValues,
    extractYears,
    getDatasetMinMax,
    getMinMax
} from "../src/linechart";
import { addDataset, clearDatasets, removeDataset } from "../src/datasets";

const countryMock1 = {
    properties: {
        production: {
            "1990": 3878394,
            "1991": 811919,
            "1992": 890222,
            "1993": 843272,
            "1994": 15278329,
            "1995": 18292011,
            "2000": 6738201,
            "2019": 673892
        },
        consumption: {
            "1990": 6478239,
            "1991": 5674839,
            "1992": 647389,
            "1993": 478390,
            "1994": 6478932,
            "1995": 18292011333,
            "2000": 6738201,
            "2019": 673892
        },
        testdataset: {},
        import: {
            "2000": 56478,
            "2001": 567890,
            "2020": 345678
        }
    }
};

const prodMinMax = { minYear: 1990, maxYear: 2019, maxValue: 18292011 };
const testdsMinMax = { minYear: undefined, maxYear: undefined, maxValue: undefined };
const importMinMax = { minYear: 2000, maxYear: 2020, maxValue: 567890 };
const consMinMax = { minYear: 1990, maxYear: 2019, maxValue: 18292011333 };

const years = [1990, 1991, 1992, 1993, 1994, 1995, 2000, 2019];
const prodValues = [3878394, 811919, 890222, 843272, 15278329, 18292011, 6738201, 673892];
const consValues = [6478239, 5674839, 647389, 478390, 6478932, 18292011333, 6738201, 673892];
const importValues = [56478, 567890, 345678];
const importYears = [2000, 2001, 2020];

const importYearsValues = [
    { year: 2000, value: 56478 },
    { year: 2001, value: 567890 },
    { year: 2020, value: 345678 }
];

describe("linechart helpers suite", () => {
    test("extract years from country data", () => {
        expect(extractYears("production", countryMock1)).toStrictEqual(years);
        expect(extractYears("consumption", countryMock1)).toStrictEqual(years);
        expect(extractYears("test-ds", countryMock1)).toStrictEqual([]);
        expect(extractYears("testdataset", countryMock1)).toStrictEqual([]);
    });

    test("extract values from country data", () => {
        expect(extractValues("production", countryMock1)).toStrictEqual(prodValues);
        expect(extractValues("consumption", countryMock1)).toStrictEqual(consValues);
        expect(extractValues("test-ds", countryMock1)).toStrictEqual([]);
        expect(extractValues("testdataset", countryMock1)).toStrictEqual([]);
    });

    test("get dataset min max from country data", () => {
        expect(getDatasetMinMax("production", countryMock1))
            .toStrictEqual(prodMinMax);
        expect(getDatasetMinMax("testdataset", countryMock1))
            .toStrictEqual(testdsMinMax);
    });

    test("combine years and values", () => {
        expect(combineYearsValues(importYears, importValues)).toStrictEqual(importYearsValues);
    });
});

describe("datasets-dependent linechart helpers suite", () => {
    beforeEach(() => {
        clearDatasets();
    });
    test("compare min max values in two datasets", () => {
        addDataset("production");
        addDataset("import");
        expect(compareMinMaxValues(prodMinMax, importMinMax))
            .toStrictEqual({ minYear: 1990, maxYear: 2020, maxValue: 18292011 });
    });

    test("compare min max values with one empty dataset", () => {
        addDataset("production");
        addDataset("testdataset");
        expect(compareMinMaxValues(prodMinMax, testdsMinMax))
            .toStrictEqual(prodMinMax);
    });

    test("compare min max values with unexisting and empty dataset", () => {
        addDataset("testdataset");
        addDataset("export");
        expect(compareMinMaxValues("testdataset", countryMock1))
            .toStrictEqual(testdsMinMax);
    });

    test("get min max of a country", () => {
        addDataset("production");
        expect(getMinMax(true, false, countryMock1)).toStrictEqual(prodMinMax);
        addDataset("consumption");
        expect(getMinMax(true, true, countryMock1)).toStrictEqual(consMinMax);
        removeDataset("consumption");
        addDataset("import");
        expect(getMinMax(true, true, countryMock1)).toStrictEqual({
            minYear: 1990,
            maxYear: 2020,
            maxValue: 18292011
        });
    });
});

