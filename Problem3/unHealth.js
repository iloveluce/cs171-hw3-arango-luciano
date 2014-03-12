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

var xOverview = d3.time.scale()
    .range([bbOverview.x, bbOverview.w]);

var yOverview = d3.scale.linear()
    .range([bbOverview.h, bbOverview.y]);


var xDetail = d3.time.scale()
    .range([bbDetail.x, bbDetail.w]);

var yDetail = d3.scale.linear()
    .range([bbDetail.h, bbDetail.y]);


var xOverviewAxis = d3.svg.axis()
    .scale(xOverview)
    .orient("bottom");

var yOverviewAxis = d3.svg.axis()
    .scale(yOverview)
    .ticks(3)
    .orient("left");



var xDetailAxis = d3.svg.axis()
    .scale(xDetail)
    .orient("bo");

var yDetailAxis = d3.svg.axis()
    .scale(yDetail)
    .orient("left");


var overviewLine = d3.svg.line()
    .x(function(d) { return xOverview(d.Date); })
    .y(function(d) { return yOverview(d.WomenHealth); });

var detailLine = d3.svg.line()
    .x(function(d) { return xDetail(d.Date); })
    .y(function(d) { return yDetail(d.WomenHealth); });

var area = d3.svg.area()
    .x(function(d) { return xDetail(d.Date); })
    .y0(bbDetail.h)
    .y1(function(d) { return yDetail(d.WomenHealth); });

d3.csv("unHealth.csv", function(data) {

    var brush = d3.svg.brush().x(xOverview).on("brush",brushed);


    data.forEach(function(d) {
    d.Date = parseDate(d.Date);
    d.WomenHealth = convertToInt(d.WomenHealth);
     });

    xOverview.domain(d3.extent(data, function(d) { return d.Date; }));
    yOverview.domain(d3.extent(data, function(d) { return d.WomenHealth; }));

    xDetail.domain(d3.extent(data, function(d) { return d.Date; }));
    yDetail.domain(d3.extent(data, function(d) { return d.WomenHealth; }));

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+ bbOverview.x +"," +bbOverview.h + ")")
      .call(xOverviewAxis);

  svg.append("g")
      .attr("class", "axis")
      .call(yOverviewAxis)
    
    var linepoints = svg.selectAll(".point")
        .data(data)
        .enter().append("svg:circle")
         .attr("fill", "steelblue")
         .attr("cx", function(d, i) { 
            return xOverview(d.Date) })
         .attr("cy", function(d, i) { 
            return yOverview(d.WomenHealth) })     
         .attr("r", 1.5);
   
   var areapoints = svg.selectAll(".point")
        .data(data)
        .enter().append("svg:circle")
         .attr("fill", "steelblue")
         .attr("cx", function(d, i) { 
            return xDetail(d.Date) })
         .attr("cy", function(d, i) { 
            return yDetail(d.WomenHealth) })     
         .attr("r", 2.5); 
  

  svg.append("path")
      .datum(data)
      .attr("class", "path overviewPath")
      .attr("d", overviewLine);

    svg.append("path")
      .datum(data)
      .attr("class", "path detailPath")
      .attr("d", detailLine);


    svg.append("path")
      .datum(data)
      .attr("class", "detailArea")
      .attr("d", area);

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + bbDetail. x + "," + bbDetail.h + ")")
      .call(xDetailAxis);

    svg.append("g")
      .attr("class", "axis")
      .call(yDetailAxis)

svg.append("g").attr("class", "brush").call(brush)
  .selectAll("rect").attr({
    height: bbOverview.h - bbOverview.y,
    transform: "translate(" + bbOverview.x +"," + bbOverview.y +  ")"
});



});


function brushed(){
   xOverview.domain(d3.extent(data, function(d) { return d.WomenHealth; }));
}

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

