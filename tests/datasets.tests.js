import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import * as ds from "../src/datasets";

describe("datasets test suite", () => {
    beforeAll(() => {
        ds.updateYear("2019");
    });

    beforeEach(() => {
        ds.clearDatasets();
    });

    test("clear datasets", () => {
        ds.addDataset("test-ds");
        ds.clearDatasets();
        expect(ds.getDatasets()).toStrictEqual([]);
    });

    test("add dataset", () => {
        ds.addDataset("consumption");
        expect(ds.getDatasets()).toStrictEqual(["consumption"]);
    });

    test("add same dataset multiple times", () => {
        ds.addDataset("test-ds");
        ds.addDataset("test-ds");
        expect(ds.getDatasets()).toStrictEqual(["test-ds"]);
    });

    test("ignore case check", () => {
        ds.addDataset("IMPORT");
        expect(ds.getDatasets()).toStrictEqual(["import"]);
    });

    test("add more than 2 different ones", () => {
        ds.addDataset("ds1");
        ds.addDataset("ds2");
        ds.addDataset("ds3");
        expect(ds.getDatasets()).toStrictEqual(["ds1", "ds2"]);
    });

    test("remove dataset", () => {
        ds.addDataset("test-ds");
        expect(ds.getDatasets()).toStrictEqual(["test-ds"]);
        ds.removeDataset("test-ds");
        expect(ds.getDatasets()).toStrictEqual([]);
    });
});

describe("year test suite", () => {
    test("get default year", () => {
        expect(ds.getYear()).toBe("2019");
    });

    test("update year", () => {
        ds.updateYear("2020");
        expect(ds.getYear()).toBe("2020");
    });
});