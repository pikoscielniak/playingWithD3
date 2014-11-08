var h = 300;
var w = 700;
var padding = 20;
var tooltip;

function getDate(d) {
    var strDate = new String(d);
    var year = strDate.substr(0, 4);
    var month = strDate.substr(4, 2) - 1;
    var day = strDate.substr(6, 2);

    return new Date(year, month, day);
}

function updateLine(ds) {
    var minDate = getDate(ds.monthlySales[0].month);
    var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1].month);

    var xScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([padding + 5, w - padding]);

    function getYMaxDomain() {
        return d3.max(ds.monthlySales, function (d) {
            return d.sales;
        });
    }

    var yScale = d3.scale.linear()
        .domain([0, getYMaxDomain()])
        .range([h - padding, 10]);

    var xAxisGen = d3.svg.axis().scale(xScale)
        .orient("bottom").tickFormat(d3.time.format("%b"));
    var yAxisGen = d3.svg.axis().scale(yScale)
        .orient("left").ticks(4);

    var lineFun = d3.svg.line()
        .x(function (d) {
            return xScale(getDate(d.month));
        })
        .y(function (d) {
            return yScale(d.sales);
        })
        .interpolate('linear');

    var svg = d3.select('body').select('#svg-' + ds.category);

    var xAxis = svg.selectAll('g.x-axis').call(xAxisGen);

    var yAxis = svg.selectAll('g.y-axis').call(yAxisGen);

    var viz = svg.selectAll('.path-' + ds.category)
        .transition()
        .duration(3000)
        .ease('elastic')//elastic, circle, bounce, linear
        .attr({
            d: lineFun(ds.monthlySales)
        });

    var dots = svg.selectAll('circle.circle-' + ds.category)
        .data(ds.monthlySales)
        .attr({
            cx: function (d) {
                return xScale(getDate(d.month));
            },
            cy: function (d) {
                return yScale(d.sales);
            }
        }).exit().remove();

}

function buildLine(ds) {
    var minDate = getDate(ds.monthlySales[0].month);
    var maxDate = getDate(ds.monthlySales[ds.monthlySales.length - 1].month);

    var xScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([padding + 5, w - padding]);

    function getYMaxDomain() {
        return d3.max(ds.monthlySales, function (d) {
            return d.sales;
        });
    }

    var yScale = d3.scale.linear()
        .domain([0, getYMaxDomain()])
        .range([h - padding, 10]);

    var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%b"))
        .ticks(ds.monthlySales.length - 1);
    var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(4);

    var lineFun = d3.svg.line()
        .x(function (d) {
            return xScale(getDate(d.month));
        })
        .y(function (d) {
            return yScale(d.sales);
        })
        .interpolate('linear');

    var svg = d3.select('body').append('svg')
        .attr({
            width: w,
            height: h,
            id: 'svg-' + ds.category
        });

    var xAxis = svg.append('g').call(xAxisGen)
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (h - padding) + ')');

    var yAxis = svg.append('g').call(yAxisGen)
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)');

    var viz = svg.append('path')
        .attr({
            d: lineFun(ds.monthlySales),
            stroke: 'purple',
            'stroke-width': 2,
            fill: 'none',
            class: 'path-' + ds.category
        });

    var dots = svg.selectAll('circle')
        .data(ds.monthlySales)
        .enter()
        .append('circle')
        .attr({
            cx: function (d) {
                return xScale(getDate(d.month));
            },
            cy: function (d) {
                return yScale(d.sales);
            },
            r: 4,
            fill: "#666666",
            class: "circle-" + ds.category
        })
        .on('mouseover', function (d) {
            tooltip.transition()
                .duration(500)
                .style('opacity', 85);

            tooltip.html('<strong>Sales $' + d.sales + 'K</strong>')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function (d) {
            tooltip.transition()
                .duration(300)
                .style('opacity', 0);
        });
}

function showHeader(ds) {
    d3.select('body').append('h1')
        .text(ds.category + " Sales(2013)");
}

function createTooltip() {
    tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
}
d3.json('https://api.github.com/repos/bsullins/d3js-resources/contents/monthlySalesbyCategoryMultiple.json',
    function (error, data) {
        if (error) {
            console.log(error);
        }

        var decodedData = JSON.parse(window.atob(data.content));

        decodedData.contents.forEach(function (ds) {
            showHeader(ds);
            createTooltip();
            buildLine(ds);
        });

        d3.select('select')
            .on('change', function (d, i) {
                var sel = d3.select('#date-option').node().value;
                var decodedData = JSON.parse(window.atob(data.content));

                decodedData.contents.forEach(function (ds) {
                    ds.monthlySales.splice(0, ds.monthlySales.length - sel);
                    updateLine(ds);
                });

            })
    });