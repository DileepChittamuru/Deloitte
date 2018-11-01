d3.select('head').append('title').text('Scatterplot')

d3.json('data.json',function (data) {

  var body = d3.select('body #chart')
 
  // Variables
  var margin = { top: 50, right: 50, bottom: 50, left: 100 }
  var h = 500 - margin.top - margin.bottom
  var w = 500 - margin.left - margin.right
  var formatPercent = d3.format('');

  // Scales
  var colorScale = d3.scale.category20()
  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d['Wholesale_Trade'] })]),
      d3.max([0,d3.max(data,function (d) { return d['Wholesale_Trade'] })])
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d['Total_Manufacturing'] })]),
      d3.max([0,d3.max(data,function (d) { return d['Total_Manufacturing'] })])
      ])
    .range([h,0])
  
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
      .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .tickFormat(formatPercent)
    .ticks(9)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .tickFormat(formatPercent)
    .ticks(9)
    .orient('left')
    
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx',function (d) { return xScale(d['Wholesale_Trade']) })
      .attr('cy',function (d) { return yScale(d['Total_Manufacturing']) })
      .attr('r','5')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(i) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width', 3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width', 1)
      })
    .append('svg:title')
    .text("") // Tooltip
    .text(function (d) { return d.Region+ "\n("+ d['Wholesale_Trade'] + ": "+ d['Total_Manufacturing'] + ")"})

  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','xAxis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
      .append('text') // X-axis Label
      .attr('id','xAxisLabel')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Wholesale_Trade')
  
  // Y-axis
  svg.append('g')
      .attr('class','axis')
      .attr('id','yAxis')
      .call(yAxis)
      .append('text') // y-axis Label
      .attr('id', 'yAxisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Total_Manufacturing')

  function yChange(value) {
    yScale // change the yScale
      .domain([
        d3.min([0,d3.min(data, function (d) {
          if(isNaN(d[value])){
              return  0;
          } else {
              return d[value];
          }
        })]),
        d3.max([0,d3.max(data, function (d) {
          if(isNaN(d[value])){
              return  0;
           } else {
              return  d[value]
           }
           })])
        ])
    yAxis.scale(yScale) // change the yScale
    d3.select('#yAxis') // redraw the yAxis
      .transition().duration(1000)
      .call(yAxis)
    d3.select('#yAxisLabel') // change the yAxisLabel
      .text(value)    
    d3.selectAll('circle')
      .transition().duration(1000)
      .delay(function (d,i) { return i*100})
      .attr('cy',function (d) { 
        if(isNaN(d[value])){
            return  0;
        } else {
            return yScale(d[value]);
        }
      })
      circles.append('svg:title')// Tooltip
      .text(function (d) { return ', '+ parseFloat(d[value]).toFixed(1)+")"})
  };

  function xChange(value) {
    xScale // change the xScale
      .domain([
        d3.min([0,d3.min(data, function (d) {
          if(isNaN(d[value])){
              return  0;
          } else {
              return  d[value]
          }
        })]),
        d3.max([0,d3.max(data, function (d) {
          if(isNaN(d[value])){
              return  0;
           } else {
              return  d[value]
           }
           })])
        ])
    xAxis.scale(xScale) // change the xScale
    d3.select('#xAxis') // redraw the xAxis
      .transition()
      .duration(1000)
      .call(xAxis)
    d3.select('#xAxisLabel') // change the xAxisLabel
      .transition()
      .duration(1000)
      .text(value)
    d3.selectAll('circle') // move the circles
      .transition()
      .duration(100)
      .delay(function (d,i) { return i*100})
      .attr('cx',function (d) {
        if(isNaN(d[value])){
           return  0;
        } else {
            return xScale(d[value]);
        }
      })
      circles.append('svg:title') // Tooltip
      .text(function (d) { 
        return " ( "+ parseFloat(d[value]).toFixed(1) ; 
      })
  };

  /* onchnage drop downs x axis y axis */
  $('#xAxis').on('change', function() {
    xChange(this.value)
  });
  $('#yAxis').on('change', function() {
    yChange(this.value)
  });
})