/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    width = 960 - margin.left - margin.right;

    height = 600 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: 10,
        w: width - 100,
        h: height
    };

 svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


        var xAxis, xScale, yAxis,  yScale, color;

          xScale = d3.scale.linear().range([bbVis.x, bbVis.w]); 
          yScale = d3.scale.linear().range([bbVis.h, bbVis.y]);  
          color = d3.scale.category10();

          
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

          var line = d3.svg.line()
                .interpolate("cardinal")
                .defined(function(d) { 
                if(d.population == 0)
                    return false;
                else
                return true })
                .x(function(d) { return xScale(d.date); })
                .y(function(d) { return yScale(d.population); });


    d3.csv("timeline.csv", function(data) {

        
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
        
      xScale.domain(d3.extent(data, function(d) {  return d.Year; }));

      var organizations = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
        return {date: d.Year, population: +d[name]}  
          })
          }
    
      });

      yScale.domain([
        d3.min(organizations, function(c) { return d3.min(c.values, function(v) { 
                if(v.population != 0)
                return v.population; }); }),
        d3.max(organizations, function(c) { return d3.max(c.values, function(v) { 
                return v.population; }); })
      ]);
  
   



    var realpop = {};
    var realdate = {};


    for (var organ in organizations)
    {
    
    realpop[organ] = organizations[organ].values.map(function(d){
        if(d.population > 0)
        return d.population})
    .filter(function(d){
        return d;
    })

    realdate[organ] = organizations[organ].values.map(function(d){
        if(d.population)
            return d.date;
    })
    .filter(function(d){
            return d
    })
  
  var temporaryscale = d3.scale.linear()
  .domain(realdate[organ])
  .range(realpop[organ]);


  var points = svg.selectAll(".point")
      .data(organizations[organ].values)
      .enter().append("svg:circle")
       .attr("stroke", function(d){ return "black";})
       .attr("fill", function(d, i) { 
           if(d.population != 0)
              return "green"
          else
              return "red" })
       .attr("cx", function(d, i) { 
          return xScale(d.date) })
       .attr("cy", function(d, i) { 

          if(d.population == 0 && d.date > d3.min(realdate[organ]) && 
                d.date < d3.max(realdate[organ]))
            {
              d.population = temporaryscale(d.date);
            } 

            var y = yScale(d.population)      
            if(isNaN(y) || y == "Infinity") // just for error checking
                return 1;
              return y;
             })
         .attr("r", function(d, i) { 
             if(d.population != 0)
                return 3;
            else
                return 0;
            
             })
    }

  var organization = svg.selectAll(".organization")
      .data(organizations)
      .enter().append("g")
      .attr("class", "organization");

 organization.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + bbVis.h + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + bbVis.x + ","+ bbVis.y+  ")")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");

    d3.select("input[value=\"absolute\"]").on("click", function(){
        console.log('here')
    });
    d3.select("input[value=\"relative\"]").on("click", random_layout);

        return 
    });

    