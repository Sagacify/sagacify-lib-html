define([], function(){
	var BarChartWithLegend = function (options){
		options = options||{};

		var data = options.data||[{values:[]}];//||exampleData();

		var loadDataColors = function(){
			var color = [
				"#ed5565", //Light red
				"#FC6E51", //Light orange
				"#ffce54", //Light yellow
				"#a0d468", //Light green
				"#48cfad", //Light turquoise
				"#4fc1e9", //Light blue
				"#5d9cec", //Light dark blue
				"#ac92ec", //Light purple
				"#ec87c0", //Light pink
				"#656d78", //Light black
				"#da4453", //Dark red
				"#e9573f", //Dark orange
				"#f6bb42", //Dark yellow
				"#8cc152", //Dark green
				"#37bc9b", //Dark turquoise
				"#3bafda", //Dark blue
				"#4a89dc", //Dark dark blue
				"#8e6edc", //Dark purple
				"#d770ad", //Dark pink
				"#434a54" //Dark dark black
			];
			data[0].values.forEach(function(item, i){
				item.color = color[i % color.length];
			});
		}
		loadDataColors();

		var containerSelector = options.containerSelector;

		var chart = nv.models.discreteBarChart()
			.x(function(d) { return d.label })
			.y(function(d) { return d.value })
			.tooltips(true)
			.showValues(true)
			.margin({top:50})

		//chart.xAxis.tickFormat("");


		var svg = d3.select(containerSelector)
		  .datum(data); 

		svg.transition().duration(500)
		  .call(chart);

		var legend = nv.models.legend();
		legend.key(function(d) { return d.label; });

		var legendSvg = svg.append("g").attr("class", "nvd3 legend");

		legendSvg.datum(data[0].values) 
			.transition()
			.duration(500)
		    .call(legend);

		legend.dispatch.on('stateChange', function(newState) {
			data[0].values.forEach(function(item, i){
				item.disabled = newState.disabled[i];
			});
			var chartData = data.clone();
			chartData[0].values = chartData[0].values.filter(function(item){
				return !item.disabled;
			});
			svg.datum(chartData).transition().duration(500).call(chart);
			legendSvg.datum(data[0].values).transition().duration(500).call(legend);
			chart.update();
		});

		nv.utils.windowResize(chart.update);
		nv.utils.windowResize(legend);

		chart.loadData = function(newData){
			data = newData;
			loadDataColors();
			svg.datum(data).transition().duration(500).call(chart);
			legendSvg.datum(data[0].values).transition().duration(500).call(legend);
			chart.update();
		}

		

		return chart;	
	};

	var exampleData = function () {
		 return  [ 
		    {
		      key: "Cumulative Return",
		      values: [
		        { 
		          "label" : "A Label" ,
		          "value" : 29.765957771107
		        } , 
		        { 
		          "label" : "B Label" , 
		          "value" : 0
		        } , 
		        { 
		          "label" : "C Label" , 
		          "value" : 32.807804682612
		        } , 
		        { 
		          "label" : "D Label" , 
		          "value" : 196.45946739256,
		        } , 
		        { 
		          "label" : "E Label" ,
		          "value" : 0.19434030906893
		        } , 
		        { 
		          "label" : "F Label" , 
		          "value" : 98.079782601442
		        } , 
		        { 
		          "label" : "G Label" , 
		          "value" : 13.925743130903
		        } , 
		        { 
		          "label" : "H Label" , 
		          "value" : 5.1387322875705
		        }

		      ]
		    }
		  ]

		}

	return BarChartWithLegend;
});
