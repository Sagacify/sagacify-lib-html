define([], function(){
	var BarChartWithLegend = function (options){
		options = options||{};

		var data = options.data||[{values:[]}];//||exampleData();

		var loadDataColors = function(){
			var color = nv.utils.defaultColor();
			data[0].values.forEach(function(item, i){
				if(!item.color)
					item.color = color(item, i);
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

		legend.width($(containerSelector).width()-40);

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
			//$('.nvd3 .nv-legend', chart.container).children().attr('transform', 'translate(33, 5)');
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
		          "value" : 196.45946739256
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
