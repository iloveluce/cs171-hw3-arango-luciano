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
 
          
        var isabsolute = true;
 
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .tickFormat(function(d) {
            if(!isabsolute){
              return formatPercent(d/100)

            }
            else{
              return d;
            }
            })
            .orient("left");


    
    var formatPercent = d3.format("0%");

    d3.csv("timeline.csv", function(data) {

        
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
        
      xScale.domain(d3.extent(data, function(d) {  return d.Year; }));

      var organizations = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
        if(d[name] > 0)
        {
           return {date: d.Year, population: +d[name]}  
        } 
          }).filter(function (d){return d})
        }})

     var mean = {};
    
        data.forEach(function(list) {
        
          mean[list.Year] = d3.mean([convertToInt(list.HYDE), convertToInt(list.Maddison), convertToInt(list.PopulationBureau),
          convertToInt(list.UN), convertToInt(list.USCensus)]) 
       })
     
    
  

    organizations.forEach(function(data)
      {
        data.values.forEach(function(d){
          d.population -=  mean[d.date];
        })})

  
       Ydomain();


    for (var organ in organizations)
    {
 
     var points = svg.selectAll(".point")
        .data(organizations[organ].values)
        .enter()
        .append("svg:circle")
        .attr("class", "dp")
        .attr("stroke", function(d){ return "black";})
        .attr("fill", function(d){
    
          return color(organizations[organ].name)
        } )
         .attr("cx", function(d, i) { 
            return xScale(d.date) })
         .attr("cy", function(d, i) { 
            return yScale(d.population)
               })
           .attr("r", function(d, i) { 
               if(d.population   != 0)
                  return 3;
              else
                  return 0;
               }).on("mouseover", function(d, y) {

     /* Tooltip thanks to D3 Chapter 10 in book*/

     //Update the tooltip position and value
     d3.select("#tooltip")
       .select("#value")
       .html(organizations[organ].name + "<br>" + "Year: " + d.date + "<br> Uncertainty: " + d.population.toFixed(2) 
        + "<br> Mean: " + mean[d.date] );

     //Show the tooltip
     d3.select("#tooltip").classed("hidden", false);

     })

     .on("mouseout", function() {

     //Hide the tooltip
     d3.select("#tooltip").classed("hidden", true);

     })

    }


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + bbVis.h + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + bbVis.x + ","+ bbVis.y+  ")")
      .call(yAxis)


  function relative(){

    if(!isabsolute)
        return
     isabsolute = false;
    organizations.forEach(function(data)
      {
        data.values.forEach(function(d){
          d.population =  100 * (  (d.population)/mean[d.date]);
        })})
  
      Ydomain();

   d3.selectAll(".dp")
      .transition()
      .duration(500)
      .attr("cy", function(d, i) { return yScale(d.population  )})

       d3.select(".y.axis").transition().duration(500).call(yAxis);
     

     
  }

  function absolute(){
    if(isabsolute)
        return
    isabsolute = true;
    
    organizations.forEach(function(data)
      {
        data.values.forEach(function(d){
          d.population =  ((d.population/ 100)) * mean[d.date];
        })})

    Ydomain();

     d3.selectAll(".dp")
      .transition()
      .duration(500)
      .attr("cy", function(d, i) { return yScale(d.population  )})

       d3.select(".y.axis").transition().duration(500).call(yAxis);
    

  }


  function Ydomain(){

    yScale.domain([
        d3.min(organizations, function(c) { return d3.min(c.values, function(v, i) { 
                if(v.population != 0){
                   return v.population ;
                }
                  }); }),
        d3.max(organizations, function(c) { return d3.max(c.values, function(v, j) { 
                
               return v.population ; }); })
      ]);
  }


    d3.select("input[value=\"absolute\"]").on("click", absolute);
    d3.select("input[value=\"relative\"]").on("click", relative);

         
    });

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};
