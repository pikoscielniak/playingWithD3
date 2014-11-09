function buildLine(ds) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var w = 400 - margin.left - margin.right;
    var h = 100 - margin.top - margin.bottom;

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
        .range([0, w]).nice();

    function getYMaxDomain() {
        return d3.max(ds.monthlySales, function (d) {
            return d.sales;
        });
    }

    var yScale = d3.scale.linear()
        .domain([0, getYMaxDomain()])
        .range([h, 0]).nice();

    var lineFun = d3.svg.line()
        .x(function (d) {
            return xScale(d.month);
        })
        .y(function (d) {
            return yScale(d.sales);
        })
        .interpolate('linear');

    var svg = d3.select('#bottomLeft').append('svg').attr({
        width: w,
        height: h
    });


    var viz = svg.append('path')
        .attr({
            d: lineFun(ds.monthlySales),
            stroke: '#666666',
            'stroke-width': 2,
            fill: 'none'
        });
}

function showHeader(ds) {
    d3.select('#bottomLeft').append('h2')
        .text(ds.category + " Sales Trend (2013)");
}

d3.json('category-sales.json', function (error, data) {
    if (error) {
        console.log(error);
    } else {
        data.contents.forEach(function (d) {
            showHeader(d);
            buildLine(d);
        });
    }
});