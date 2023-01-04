import { treemapSlice } from "d3";

interface Temperature {
    year: number;
    month: number;
    variance: number
}

interface Temperatures {
    baseTemperature: number;
    monthlyVariance: Array<Temperature>;
}

function validateTemperature(temp: Temperature) {
    return typeof temp.year === "number" && temp.year > 0 &&
        typeof temp.month === "number" && temp.month > 0 &&
        typeof temp.variance === "number";
}

function validateTemperatures(temps: Temperatures) {
    if (typeof temps.baseTemperature !== "number") {
        console.error("validateTemperatures: baseTemperature: expected a " + 
            "number bot got a " + typeof temps.baseTemperature);
        return false;
    }

    if (!Array.isArray(temps.monthlyVariance)) {
        console.error("validateTemperatures: monthlyVariance: expected an Array" +
            "but got a " + typeof temps.monthlyVariance);
        return false;
    }

    for (let i = 0; i < temps.monthlyVariance.length; ++i) {
        if (!validateTemperature(temps.monthlyVariance[i])) {
            console.error("validateTemperatures: monthlyVariance at index " + i +
                " was invalid");
            return false;
        }
    }

    return true;
}

// GET request data synchronously
// Returns Temperatures object on success and null on failure
export function getData(url: string): Temperatures | null {
    const xhr = new XMLHttpRequest;
    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status === 200) {
        const obj = JSON.parse(xhr.response);
        validateTemperatures(obj);

        return obj;
    } else {
        console.error("Failed to retrieve data from " + url + 
            ", with status: " + xhr.status);
        return null;
    }
}
