import { Color } from "./color"

export namespace Const {
    export const DataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    
    export const GraphWidth = 1600;
    export const GraphHeight = 520;
    export const TablePaddingX = 120;
    export const TablePaddingY = 20;
    export const GraphMinColor = new Color(28, 127, 180, 255, true);
    export const GraphMaxColor = new Color(180, 127, 28, 255, true);
    export const TableHeight = 400;

}