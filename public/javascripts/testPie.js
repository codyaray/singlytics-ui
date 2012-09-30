// heavily influenced by http://bl.ocks.org/2212156

function drawPie( pieName, dataSet, selectString, colors, margin, outerRadius, innerRadius, sortArcs ) {

// pieName => A unique drawing identifier that has no spaces, no "." and no "#" characters.
// dataSet => Input Data for the chart, itself.
// selectString => String that allows you to pass in
//           a D3 select string.
// colors => String to set color scale.  Values can be...
//           => "colorScale10"
//           => "colorScale20"
//           => "colorScale20b"
//           => "colorScale20c"
// margin => Integer margin offset value.
// outerRadius => Integer outer radius value.
// innerRadius => Integer inner radius value.
// sortArcs => Controls sorting of Arcs by value.
//              0 = No Sort.  Maintain original order.
//              1 = Sort by arc value size.

// Color Scale Handling...
  var colorScale = d3.scale.category20c();
  var canvasWidth = 700;
  var pieWidthTotal = outerRadius * 2;;
  var pieCenterX = outerRadius + margin/2;
  var pieCenterY = outerRadius + margin/2;
  var legendBulletOffset = 30;
  var legendVerticalOffset = outerRadius - margin;
  var legendTextOffset = 20;
  var textVerticalSpace = 20;
  var canvasHeight = 0;
  var pieDrivenHeight = outerRadius*2 + margin*2;
  var legendTextDrivenHeight = (dataSet.length * textVerticalSpace) + margin*2;
  // Autoadjust Canvas Height
 
  if (pieDrivenHeight >= legendTextDrivenHeight) {
    canvasHeight = pieDrivenHeight; }
  else  {
    canvasHeight = legendTextDrivenHeight; }
 
  var x = d3.scale.linear().domain([0, d3.max(dataSet, function(d) { return d.magnitude; })]).rangeRound([0, pieWidthTotal]);
  var y = d3.scale.linear().domain([0, dataSet.length]).range([0, (dataSet.length * 20)]);
  
  var synchronizedMouseOver = function() {
    var arc = d3.select(this);
    var indexValue = arc.attr("index_value");

    var arcSelector = "." + "pie-" + pieName + "-arc-" + indexValue;
    var selectedArc = d3.selectAll(arcSelector);
    selectedArc.style("fill", "#FFD24D");

    var bulletSelector = "." + "pie-" + pieName + "-legendBullet-" + indexValue;
    var selectedLegendBullet = d3.selectAll(bulletSelector);
    selectedLegendBullet.style("fill", "#FFD24D");

    var textSelector = "." + "pie-" + pieName + "-legendText-" + indexValue;
    var selectedLegendText = d3.selectAll(textSelector);
    selectedLegendText.style("fill", "#FFD24D");
  };

  var synchronizedMouseOut = function() {
    var arc = d3.select(this);
    var indexValue = arc.attr("index_value");

    var arcSelector = "." + "pie-" + pieName + "-arc-" + indexValue;
    var selectedArc = d3.selectAll(arcSelector);
    var colorValue = selectedArc.attr("color_value");
    selectedArc.style("fill", colorValue);

    var bulletSelector = "." + "pie-" + pieName + "-legendBullet-" + indexValue;
    var selectedLegendBullet = d3.selectAll(bulletSelector);
    var colorValue = selectedLegendBullet.attr("color_value");
    selectedLegendBullet.style("fill", colorValue);

    var textSelector = "." + "pie-" + pieName + "-legendText-" + indexValue;
    var selectedLegendText = d3.selectAll(textSelector);
    selectedLegendText.style("fill", "#60798C");
  };

  var tweenPie = function (b) {
    b.innerRadius = 0;
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t) {
      return arc(i(t));
    };
  }

  // Create a drawing canvas...
  var canvas = d3.select(selectString)
    .append("svg:svg") //create the SVG element inside the <body>
      .data([dataSet]) //associate our data with the document
      .attr("width", canvasWidth) //set the width of the canvas
      .attr("height", canvasHeight) //set the height of the canvas
      .append("svg:g") //make a group to hold our pie chart
        .attr("transform", "translate(" + pieCenterX + "," + pieCenterY + ")") // Set center of pie

  // Define an arc generator. This will create <path> elements for using arc data.
  var arc = d3.svg.arc()
    .innerRadius(innerRadius) // Causes center of pie to be hollow
      .outerRadius(outerRadius);

// Define a pie layout: the pie angle encodes the value of dataSet.
// Since our data is in the form of a post-parsed CSV string, the
// values are Strings which we coerce to Numbers.
      var pie = d3.layout.pie()
    .value(function(d) { return d.magnitude; })
    .sort(function(a, b) {if (sortArcs==1) { return b.magnitude - a.magnitude; } else { return null; } });

      // Select all <g> elements with class slice (there aren't any yet)
      var arcs = canvas.selectAll("g.slice")
        // Associate the generated pie data (an array of arcs, each having startAngle,
        // endAngle and value properties) 
        .data(pie)
        // This will create <g> elements for every "extra" data element that should be associated
        // with a selection. The result is creating a <g> for every object in the data array
        // Create a group to hold each slice (we will have a <path> and a <text>      // element associated with each slice)
  .enter().append("svg:a")
          .attr("xlink:href", function(d) { return d.data.link; })
          .append("svg:g")
            .attr("class", "slice")    //allow us to style things in the slices (like text)
            // Set the color for each slice to be chosen from the color function defined above
            // This creates the actual SVG path using the associated data (pie) with the arc drawing function
            .style("stroke", "White" )
            .attr("d", arc);

      arcs.append("svg:path")
        // Set the color for each slice to be chosen from the color function defined above
        // This creates the actual SVG path using the associated data (pie) with the arc drawing function
        .attr("fill", function(d, i) { return colorScale(i); } )
        .attr("color_value", function(d, i) { return colorScale(i); }) // Bar fill color...
        .attr("index_value", function(d, i) { return "index-" + i; })
        .attr("class", function(d, i) { return "pie-" + pieName + "-arc-index-" + i; })
        .style("stroke", "White" )
        .attr("d", arc)
        .on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut)
        .transition()
          .ease("bounce")
          .duration(2000)
          .delay(function(d, i) { return i * 50; })
          .attrTween("d", tweenPie);

      // Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
      arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
        .attr("transform", function(d) { //set the label's origin to the center of the arc
          //we have to make sure to set these before calling arc.centroid
          d.outerRadius = outerRadius; // Set Outer Coordinate
          d.innerRadius = innerRadius; // Set Inner Coordinate
          return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
        })
        .style("fill", "White")
        .style("font", "normal 12px Arial")
        .text(function(d) { return d.data.magnitude; });

      // Computes the angle of an arc, converting from radians to degrees.
      function angle(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
      }

      // Plot the bullet circles...
      canvas.selectAll("circle")
        .data(dataSet).enter().append("svg:circle") // Append circle elements
        .attr("cx", pieWidthTotal + legendBulletOffset)
        .attr("cy", function(d, i) { return i*textVerticalSpace - legendVerticalOffset; } )
        .attr("stroke-width", ".5")
        .style("fill", function(d, i) { return colorScale(i); }) // Bullet fill color
        .attr("r", 5)
        .attr("color_value", function(d, i) { return colorScale(i); }) // Bar fill color...
        .attr("index_value", function(d, i) { return "index-" + i; })
        .attr("class", function(d, i) { return "pie-" + pieName + "-legendBullet-index-" + i; })
        .on('mouseover', synchronizedMouseOver)
        .on("mouseout", synchronizedMouseOut);

      // Create hyper linked text at right that acts as label key...
      canvas.selectAll("a.legend_link")
        .data(dataSet) // Instruct to bind dataSet to text elements
        .enter().append("svg:a") // Append legend elements
          .attr("xlink:href", function(d) { return d.link; })
          .append("text")
            .attr("text-anchor", "center")
            .attr("x", pieWidthTotal + legendBulletOffset + legendTextOffset)
            //.attr("y", function(d, i) { return legendOffset + i*20 - 10; })
        //.attr("cy", function(d, i) {    return i*textVerticalSpace - legendVerticalOffset; } )
            .attr("y", function(d, i) { return i*textVerticalSpace - legendVerticalOffset; } )
            .attr("dx", 0)
            .attr("dy", "5px") // Controls padding to place text in alignment with bullets
            .text(function(d) { return d.legendLabel;})
            .attr("color_value", function(d, i) { return colorScale(i); }) // Bar fill color...
            .attr("index_value", function(d, i) { return "index-" + i; })
            .attr("class", function(d, i) { return "pie-" + pieName + "-legendText-index-" + i; })
            .style("fill", "#60798C")
            .style("font", "normal 1.5em Arial")
            .on('mouseover', synchronizedMouseOver)
            .on("mouseout", synchronizedMouseOut);

};

function drawTime(){
  
};

//d3.json("/application/json/" + appName, function(json){ 

 d3.json("/javascripts/demographics.json", function(json){ 
  var ages = json.demographics.ages;    	
  var genders = json.demographics.gender;
  var locations = json.demographics.locations;
  
  var agegroups = {
	 "12to17": 0,
	 "18to24": 0,
	 "25to34": 0,
	 "35to44": 0,
	 "45to54": 0,
	 "55to64": 0,
	 "65andup": 0,		
	 "unknown": 0 };
		
  for(age in ages){
		if(age >= 12 && age <= 17){
			agegroups["12to17"] += ages[age];
		} else if(age >= 18 && age <= 24){
			agegroups["18to24"] += ages[age];
		} else if(age >= 25 && age <= 34){
			agegroups["25to34"] += ages[age];
		} else if(age >= 35 && age <= 44){
			agegroups["35to44"] += ages[age];
		} else if(age >= 45 && age <= 54){
			agegroups["45to54"] += ages[age];
		} else if(age >= 55 && age <= 64){
			agegroups["55to64"] += ages[age];
		} else if(age >= 65) {
			agegroups["65andup"] += ages[age];
		} else if(age == "unknown"){
			agegroups["unknown"] += ages[age];
		}
	}
	
	var gendergroups = {};
	for(gender in genders){
	  gendergroups[gender] = 0;
	}
	
  for(gender in genders){
	    gendergroups[gender] += genders[gender];
	}
	
	var locationgroups = {};
	for (loc in locations) {
	    locationgroups[loc] = 0;
	}

	for (loc in locations){
	    locationgroups[loc] += locations[loc];
	}
	
	var agegroups = [
  		{legendLabel: "12 - 17", magnitude: agegroups["12to17"]},
  		{legendLabel: "18 - 24", magnitude: agegroups["18to24"]},
  		{legendLabel: "25 - 34", magnitude: agegroups["25to34"]},
  		{legendLabel: "35 - 44", magnitude: agegroups["35to44"]},
  		{legendLabel: "45 - 54", magnitude: agegroups["45to54"]},
  		{legendLabel: "55 - 64", magnitude: agegroups["55to64"]},
  		{legendLabel: "65+", magnitude: agegroups["65andup"]},
  		{legendLabel: "Unknown", magnitude: agegroups["unknown"]} ];
  
  var gengroups = [];
  for (gender in gendergroups){
    gengroups.push({legendLabel: gender, magnitude: gendergroups[gender]});
  }
  
  var locgroups = [];
  for (loc in locationgroups) {
    locgroups.push({legendLabel: loc, magnitude: locationgroups[loc]});
  }

	drawPie("Pie1", agegroups, "div.ages", "colorScale20", 10, 100, 5, 0);
	drawPie("Pie2", gengroups, "div.genders", "colorScale20", 10, 100, 5, 0);
	drawPie("Pie3", locgroups, "div.locations", "colorScale20", 10, 100, 5, 0);

});


  
