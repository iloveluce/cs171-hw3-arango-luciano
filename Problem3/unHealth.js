var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 60
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};

dataSet = [];

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });



var parseDate = d3.time.format("%B %Y").parse;

var x = d3.time.scale()
    .range([0, bbOverview.w]);

var y = d3.scale.linear()
    .range([bbOverview.h, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var line = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.WomenHealth); });


d3.csv("unHealth.csv", function(data) {

    data.forEach(function(d) {
    d.Date = parseDate(d.Date);
    d.WomenHealth = convertToInt(d.WomenHealth);
     });

    x.domain(d3.extent(data, function(d) { return d.Date; }));
    y.domain(d3.extent(data, function(d) { return d.WomenHealth; }));

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + bbOverview.h + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", bbOverview.y)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

  svg.append("path")
      .datum(data)
      .attr("class", "overviewPath path")
      .attr("d", line);



});

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

