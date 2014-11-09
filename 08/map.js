d3.csv('state-sales.csv', function (data) {
    var margin = {top: 20, right: 30, bottom: 30, left: 40};
    var w = 400 - margin.left - margin.right;
    var h = 400 - margin.top - margin.bottom

    var projection = d3.geo.albersUsa()
        .translate([w / 2 + 10, (h / 2) - 80])
        .scale([h + 50]);

    var path = d3.geo.path().projection(projection);

    var color = d3.scale.linear()
        .range(['rgb(254,240,217)', 'rgb(253,212,158)', 'rgb(253,187,132)', 'rgb(252,141,89)', 'rgb(227,74,51)', 'rgb(179,0,0)']);

    color.domain([0, d3.max(data, function (d) {
        return d.sales
    })]);

    d3.json('geo.json', function (json) {


        var svg = d3.select('#bottomRight')
            .append('svg')
            .attr({
                width: w,
                height: h
            });

        for (var i = 0; i < data.length; i++) {
            var salesState = data[i].state;
            var salesVal = parseFloat(data[i].sales);

            for (var j = 0; j < json.features.length; j++) {
                var usState = json.features[j].properties.NAME;
                if (salesState == usState) {
                    json.features[j].properties.value = salesVal;
                    break;
                }
            }
        }

        var mapTooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .attr('id', 'mapTooltip')
            .style('opacity', 0);

        svg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', function (d) {
                var value = d.properties.value;
                if (value) {
                    return color(value);
                } else {
                    return '#666666';
                }
            })
            .on('mouseover', function (d) {
                mapTooltip.transition()
                    .duration(500)
                    .style('opacity', .9);

                var tip = '<strong>' + d.properties.NAME + '</strong><br/>';
                var tip = tip + '<strong>Sales:</strong> $' + formatSales(d.properties.value);
                mapTooltip.html(tip)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px')
            })
            .on('mouseout', function (d) {
                mapTooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
        var legendData = [];
        json.features.forEach(function (prop) {
            var val = parseFloat(prop.properties.value);
            if (val) {
                legendData.push(val);
            }
        });

        legendData.sort(compareNum);

        svg.selectAll('rect')
            .data(legendData)
            .enter()
            .append('rect')
            .attr({
                x: function (d, i) {
                    return i * (w / legendData.length);
                },
                y: h - 140,
                width: function (d, i) {
                    return (w / legendData.length);
                },
                height: 10,
                fill: function (d) {
                    return color(d);
                }
            });

        svg.selectAll('text')
            .data([legendData[0], legendData[legendData.length - 1]])
            .enter()
            .append('text')
            .text(function (d) {
                return formatSales(d);
            })
            .attr({
                x: function (d, i) {
                    return (w - (margin.left / 2)) * i;
                },
                y: h - 150,
                "font-size": '12px',
                'font-family': 'sans-serif'
            })
    });
});
