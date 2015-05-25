var table;
var chart;
$(document).ready(function(){
	chart = dc.barChart('#noretained-chart');
	table = dc.dataTable('.dc-data-table');
    $.when(
		// Load agin json file
        $.getJSON('scm-static.json', function (d) {
            datas = d;
        })
    ).done(function(){
        var data = dcFormat(datas);
        var ndx = crossfilter(data);
		var all = ndx.groupAll();
		
		var dim = ndx.dimension(function(d){
			return d.key;
		});
		var grp = dim.group().reduceSum(function(d){
			return d.value;
		});

		chart
			.width(990).height(990)
            .dimension(dim)
            .group(grp)
//			.gap(1)
//            .x(d3.scale.linear().domain([0,32]))
			.x(d3.scale.ordinal().domain([""])) // Need empty val to offset first value
			.xUnits(dc.units.ordinal)
			.elasticX(true)
			.centerBar(true)
			.elasticY(true)
			.brushOn(true)
			.renderHorizontalGridLines(true)
			.margins({top: 0, right: 50, bottom: 200, left: 40});
//        companyChart.xAxis().tickFormat(function(d) {return d});
//        chart.yAxis().ticks(15);
		chart.on("renderlet", function(chart){
			chart.selectAll("g.x text").attr("transform","translate(-10, 80) rotate(270)");	
		})
/*********************************************************************************************************************************
**************************************************************** Table ***********************************************************
*********************************************************************************************************************************/
		var nameDim = ndx.dimension(function (d) {
            return d.key;
        });
        table
            .dimension(nameDim)
            .group(function (d) {return d.key;})
            .size(20)
            .columns([
                'key',
				'value'
			])
			.sortBy(function (d) {
                return d.value;
            })
            .order(d3.ascending);
		table.on('renderlet', function(table) {
			table.selectAll('.dc-table-group').classed('info', true);
		});


        dc.renderAll();
    });
});
/*********************************************************************************************************************************
***************************************************** Valid format for dc.js *****************************************************
*********************************************************************************************************************************/
function dcFormat(d){
	var keys = Object.keys(d)
    var array = [];
    keys.forEach(function(element){
		array.push({'key': element, 'value': d[element]})
	});
    return array;
}
