var h = 100;
var w = 400;

function buildLine(ds) {
    var lineFun = d3.svg.line()
        .x(function (d) {
            return (d.month - 20130001) / 3.25;
        })
        .y(function (d) {
            return h - d.sales;
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

d3.json('https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json', function (error, data) {
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