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


svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });



var parseDate = d3.time.format("%B %Y").parse;

// since both have the same x and width, made only one xscale to save code
var x = d3.time.scale()
    .range([bbOverview.x, bbOverview.w]);

var yline = d3.scale.linear()
    .range([bbOverview.h, bbOverview.y]);


var yarea = d3.scale.linear()
    .range([bbDetail.h, bbDetail.y]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var ylineAxis = d3.svg.axis()
    .scale(yline)
    .ticks(3)
    .orient("left");


var yareaAxis = d3.svg.axis()
    .scale(yarea)
    .orient("left");


var line = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return yline(d.WomenHealth); });

var arealine = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return yarea(d.WomenHealth); });

var area = d3.svg.area()
    .x(function(d) { return x(d.Date); })
    .y0(bbDetail.h)
    .y1(function(d) { return yarea(d.WomenHealth); });

d3.csv("unHealth.csv", function(data) {

    var brush = d3.svg.brush().x(x).on("brush", function(d)
        {
            console.log("here")
        });


    data.forEach(function(d) {
    d.Date = parseDate(d.Date);
    d.WomenHealth = convertToInt(d.WomenHealth);
     });

    x.domain(d3.extent(data, function(d) { return d.Date; }));
    yline.domain(d3.extent(data, function(d) { return d.WomenHealth; }));

    yarea.domain(d3.extent(data, function(d) { return d.WomenHealth; }));

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+ bbOverview.x +"," +bbOverview.h + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .call(ylineAxis)
    
    var linepoints = svg.selectAll(".point")
        .data(data)
        .enter().append("svg:circle")
         .attr("fill", "steelblue")
         .attr("cx", function(d, i) { 
            return x(d.Date) })
         .attr("cy", function(d, i) { 
            return yline(d.WomenHealth) })     
         .attr("r", 1.5);
   
   var areapoints = svg.selectAll(".point")
        .data(data)
        .enter().append("svg:circle")
         .attr("fill", "steelblue")
         .attr("cx", function(d, i) { 
            return x(d.Date) })
         .attr("cy", function(d, i) { 
            return yarea(d.WomenHealth) })     
         .attr("r", 2.5); 
  

  svg.append("path")
      .datum(data)
      .attr("class", "path overviewPath")
      .attr("d", line);

    svg.append("path")
      .datum(data)
      .attr("class", "path detailPath")
      .attr("d", arealine);


    svg.append("path")
      .datum(data)
      .attr("class", "detailArea")
      .attr("d", area);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + bbDetail. x + "," + bbDetail.h + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis")
      .call(yareaAxis)

svg.append("g").attr("class", "brush").call(brush)
  .selectAll("rect").attr({
    height: bbOverview.h - bbOverview.y,
    transform: "translate(" + bbOverview.x +"," + bbOverview.y +  ")"
});



});

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

