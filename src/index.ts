import { Const } from "./constants"
import { getData } from "./data"
import * as d3 from "d3"


const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// ----- Main program -----

function main() {
    const data = getData(Const.DataUrl);
    if (!data) {
        console.error("Failed to fetch data!");
        return -1;
    }

    const app = d3.select("body").append("div")
        .attr("id", "app");
    const graph = app.append("svg")
        .attr("class", "graph")
        .attr("width", Const.GraphWidth)
        .attr("height", Const.GraphHeight);

    // Create scales

    // Years as numbers
    const [minYear, maxYear] = d3.extent(data.monthlyVariance, d => d.year);
    const scaleX = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([Const.TablePaddingX, Const.GraphWidth - Const.TablePaddingX]);
    // Month as numbers
    const [minMonth, maxMonth] = [1, 12];
    const scaleY = d3.scaleLinear()
        .domain([0, maxMonth])
        .range([Const.TableHeight - Const.TablePaddingY, Const.TablePaddingY]);

    // Create axes
    const bottomAxis = d3.axisBottom(scaleX)
        .tickFormat(d3.format("d"))
    graph.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${scaleY(0)})`)
        .call(bottomAxis);

    const leftAxis = d3.axisLeft(scaleY)
        .tickValues([.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5])
        .tickFormat((domain, index) => monthNames[index]);
    graph.append("g")
        .attr("id", "y-axis")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${scaleX(minYear)}, 0)`)
        .call(leftAxis);

    // Create legend
    const [minCelsius, maxCelsius] = d3.extent(data.monthlyVariance, d => d.variance + data.baseTemperature);
    let legendValues: Array<number> = [];
    const tickWidth = (maxCelsius-minCelsius)/12;
    for (let i = minCelsius + tickWidth; i < maxCelsius; i += tickWidth) {
        legendValues.push(i);
    }

    const legendScale = d3.scaleLinear()
        .domain([minCelsius, maxCelsius])
        .range([0, 300])
    const legendAxis = d3.axisBottom(legendScale)
        .tickFormat(d3.format(".1f"))
        .tickValues(legendValues);

    const legend = graph.append("g")
        .attr("id", "legend")
        .attr("class", "legend")
        .attr("transform", `translate(64, ${scaleY(0) + 64})`)
        .call(legendAxis);
    
    const legendValuesForRects = legendValues.slice(0, legendValues.length-1);
    legend.selectAll("rect")
        .data(legendValuesForRects)
        .enter()
        .append("rect")
            .attr("class", "legend-cell")
            .attr("width", legendScale(tickWidth) - legendScale(0))
            .attr("height", legendScale(tickWidth) - legendScale(0))
            .attr("x", d => legendScale(d))
            // .attr("y", scaleY(0) + 64 - legendAxis.tickSize())
            .attr("y", -(legendScale(tickWidth) - legendScale(0)))
            .attr("fill", d => Const.GraphMinColor.lerpTo(Const.GraphMaxColor, (d - minCelsius) / (maxCelsius-minCelsius)).toString());
            

    // Create labels
    graph.append("text")
        .text("Months")
        .style("font-size", ".7rem")
        .attr("transform", `translate(32, ${scaleY(maxMonth/2) + 32}) rotate(-90)`);

    graph.append("text")
        .text("Years")
        .style("font-size", ".7rem")
        .attr("transform", `translate(${scaleX((maxYear-minYear)/2 + minYear) - 32}, ${scaleY(0) + 64})`);

    graph.append("text")
        .text("Degrees Celsius")
        .style("font-size", ".7rem")
        .attr("transform", `translate(172, ${scaleY(0) + 100})`)

    
    // Create tooltip
    const tooltip = app.append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip");
    tooltip.append("p")
        .attr("class", "date");
    tooltip.append("p")
        .attr("class", "temp")
    tooltip.append("p")
        .attr("class", "rel-temp");

    // Create cells
    const cellWidth = (Const.GraphWidth-Const.TablePaddingX*2) / (maxYear - minYear);
    const cellHeight = (Const.TableHeight-Const.TablePaddingY*2) / maxMonth;
    
    const cells = graph.selectAll("rect:not(.legend-cell)")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
            .attr("class", "cell")
            .attr("x", d => scaleX(d.year))                   // cell position and size
            .attr("y", d => scaleY(d.month))
            .attr("width", bottomAxis.tickSize() + "px")
            .attr("height", cellHeight)
            .attr("fill", d => Const.GraphMinColor.lerpTo(Const.GraphMaxColor, (d.variance + data.baseTemperature - minCelsius) / (maxCelsius-minCelsius)).toString())
            .attr("data-month", d => d.month-1)                 // cell data for testing
            .attr("data-year", d => d.year)
            .attr("data-temp", d => d.variance)
            .on("mouseover", function(event: MouseEvent, d) { // mouse hover callbacks
                const rect = d3.select(this);
               
                tooltip.select(".date")
                    .text(d.year + " - " + monthNames[d.month-1]);
                tooltip.select(".temp")
                    .text(d3.format(".1f")(d.variance + data.baseTemperature) + "℃")
                tooltip.select(".rel-temp")
                    .text(d3.format(".1f")(d.variance) + "℃");
                    
                tooltip
                    .attr("data-year", d.year)
                    .style("visibility", "visible")
                    .style("left", parseFloat(rect.attr("x")) + graph.node().getBoundingClientRect().x - tooltip.node().getBoundingClientRect().width/2 + "px")
                    .style("top", (parseFloat(rect.attr("y")) + graph.node().getBoundingClientRect().y - tooltip.node().getBoundingClientRect().height ) + "px");
            })
            .on("mouseleave", function(event: MouseEvent, d) {
                tooltip
                    .style("visibility", "hidden");
            });
    
}

main();
