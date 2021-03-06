var n = 40,
    random = d3.random.normal(0, .2),
    data = d3.range(n).map(random);
    duration = 1000,
    now = new Date(Date.now() - duration)
var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var x = d3.time.scale()
            .domain([now - (n - 2), now - duration])
            .range([0, width])
var y = d3.scale.linear()
    .domain([0, 1000])
    .range([height, 0]);
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) {
                return x(now - (n - 1 - i) * duration)
            })
    .y(function(d) { return y(d); });
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);
svg.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));
var axis = svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(x.axis = d3.svg.axis().scale(x).orient('bottom'));
var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);
var current_size = 0,prev_size = 0,diff = 0;
var display_ratio = {}
        display_ratio["Megabytes"] = 1024*1024
        display_ratio["Kilobytes"] = 1024
        display_ratio["Gigabytes"] = 1024*1024*1024

function tick() {
  now = new Date()
  $.get( "/api/json", 
        function( resp ) {
        current_size = resp["bytes"];    
  });
  diff = current_size - prev_size;
  prev_size = current_size;
  data.push(diff/display_ratio["Kilobytes"]);
  console.log(diff);
  // push a new data point onto the back
  x.domain([now - (n - 2) * duration, now - duration])

  axis.transition()
                .duration(duration)
                .ease('linear')
                .call(x.axis)
  // redraw the line, and slide it to the left
  path
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(duration)
      .ease("linear")
      .attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')')
      .each("end", tick);
  // pop the old data point off the front
  data.shift();
}
tick() 
