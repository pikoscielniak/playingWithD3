var h = 300;
var w = 700;

function buildLine(ds) {

    function getXMinDomain() {
        return d3.min(ds.monthlySales, function (d) {
            return d.month;
        });
    }

    function getXMaxDomain() {
        return d3.max(ds.monthlySales, function (d) {
            return d.month;
        });
    }

    var xScale = d3.scale.linear()
        .domain([getXMinDomain(), getXMaxDomain()])
        .range([0, w]);

    function getYMaxDomain() {
        return d3.max(ds.monthlySales, function (d) {
            return d.sales;
        });
    }

    var yScale = d3.scale.linear()
        .domain([0, getYMaxDomain()])
        .range([h, 0]);

    var lineFun = d3.svg.line()
        .x(function (d) {
            return xScale(d.month);
        })
        .y(function (d) {
            return yScale(d.sales);
        })
        .interpolate('linear');

    var svg = d3.select('body').append('svg')
        .attr({
            width: w,
            height: h
        });

    var viz = svg.append('path')
        .attr({
            d: lineFun(ds.monthlySales),
            stroke: 'purple',
            'stroke-width': 2,
            fill: 'none'
        });
}

function showHeader(ds) {
    d3.select('body').append('h1')
        .text(ds.category + " Sales(2013)");
}

d3.json('https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json',
    function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }

        var decodedData = JSON.parse(window.atob(data.content));

        decodedData.contents.forEach(function (d) {
            console.log(d)
            showHeader(d);
            buildLine(d);
        });
    });