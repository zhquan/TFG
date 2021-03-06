var aging = {};
var birth = {};
var originalNdx;
var chart_year;
var chart_month;
var chart_demograph;
var chart_day;
$(document).ready(function(){
	$.when(
        $.getJSON('its-demographics-aging.json', function (data) {
            aging = data;
        }),
        $.getJSON('its-demographics-birth.json', function (data) {
            birth = data;
        })
    ).done(function(){
		var data = birAgin(birth['persons'], aging['persons']);
        var cf = cfFormat(data);
		var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
		cf.forEach(function (d) {
			d.one = 1; // value 1 for each data
			d.dd = dateFormat.parse(birth['date']);
			d.day = 16469-d.age;
			d.date = dateFormat.parse(dateFormat(new Date(1970, 0, d.day)));
		});
		var ndx = crossfilter(cf);
		originalNdx = ndx;
		var year_data = yearBar_data(ndx);
		draw_yearBar(year_data, ndx);
		var month_data = monthPie_data(ndx);
		draw_monthPie(month_data, ndx);
		var demo_data = demograph_data(ndx);
		draw_demograph(demo_data, ndx);
		var day_data = dayPie_data(ndx);
		draw_day(day_data, ndx);
console.log("FIN")
	});
});
//------------------------------------ YEAR BAR DATA -----------------------------------------
function yearBar_data(ndx){
	var dim = ndx.dimension(function(d) {
		return d.date.getFullYear();
	});
	var grp = dim.group().reduceSum(function(d) {
		return d.one;
	});
	var year_data = c3Format('year', grp);
	return year_data;
}
// ------------------------------------- YEAR BAR DRAW -------------------------------------------------
function draw_yearBar(year_data, ndx){
console.log('draw_yearBar')
console.log(year_data);
	chart_year = c3.generate({
		data: {
			//x: 'x',
			columns: year_data,
			type: 'bar',
			//labels: true,
			onclick: function (d, i) {
				// refresh chart_month
				var new_data_month = refresh(ndx, d.id, 'month_year');
				var data_month = c3Format('month', new_data_month);
				chart_month.load({
					columns: data_month
				});
				// refresh chart_demograph
				var new_data_demograph = refresh(ndx, d.id, 'demograph_year');
				var data_demograph = c3Format('demograph', new_data_demograph);
				chart_demograph.load({
					columns: data_demograph
				})
				// refresh chart_day
				var new_data_day = refresh(ndx, d.id, 'day_year');
				var data_day = c3Format('day', new_data_day);
//				data_day.shift();
				chart_day.load({
					columns:data_day
				});
				//var i = year_data[0].indexOf(d.x.getFullYear()+'-01-01');
				//year_data[0].splice(i, 1);
				//year_data[1].splice(i, 1);
				if (d.id == 2001){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000'),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2002){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000'),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2003){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000'),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2004){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000'),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2005){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000'),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2006){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000'),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2007){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000'),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2008){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000'),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2009){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000'),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2010){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000'),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2011){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000'),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2012){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000'),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2013){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000'),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2014){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000'),
						2015: d3.rgb('#ff0000').darker(2),
					});
				}else if (d.id == 2015){
					chart_year.data.colors({
						2001: d3.rgb('#ff0000').darker(2),
						2002: d3.rgb('#ff0000').darker(2),
						2003: d3.rgb('#ff0000').darker(2),
						2004: d3.rgb('#ff0000').darker(2),
						2005: d3.rgb('#ff0000').darker(2),
						2006: d3.rgb('#ff0000').darker(2),
						2007: d3.rgb('#ff0000').darker(2),
						2008: d3.rgb('#ff0000').darker(2),
						2009: d3.rgb('#ff0000').darker(2),
						2010: d3.rgb('#ff0000').darker(2),
						2011: d3.rgb('#ff0000').darker(2),
						2012: d3.rgb('#ff0000').darker(2),
						2013: d3.rgb('#ff0000').darker(2),
						2014: d3.rgb('#ff0000').darker(2),
						2015: d3.rgb('#ff0000'),
					});
				}
			}
		},
		tooltip: {
			grouped: false,
			format: {
				title: function () {return 'Year';}
			}
		},
		size: {
			height: 350,
			width: 450
		},
		bindto: d3.select('#year')
	});
}
// --------------------------------------------- MONTH PIE DATA -----------------------------------
function monthPie_data(ndx){
	var dim = ndx.dimension(function(d) {
		return d.date.getMonth()+1;
	});
	var grp = dim.group().reduceSum(function(d) {
		return d.one;
	});
	var month_data = c3Format('month', grp);
	return month_data;
}
// ------------------------------------------ MONTH PIE DRAW ------------------------------------------
function draw_monthPie(month_data, ndx){
	chart_month = c3.generate({
		data: {
			columns: month_data,
			type : 'pie',
			onclick: function (d, i) {
				// refresh chart_year
				var new_data_year = refresh(ndx, d.name, 'year_month');
				var data_year = c3Format('year', new_data_year);
//				data_year.shift();
				chart_year.load({
					columns: data_year
				});
				// refresh chart_demograph
				var new_data_demograph = refresh(ndx, d.name, 'demograph_month');
				var data_demograph = c3Format('demograph', new_data_demograph);
				chart_demograph.load({
					columns: data_demograph	
				});
				// refresh chart_day
				var new_data_day = refresh(ndx, d.name, 'day_month');
				var data_day = c3Format('day', new_data_day);
//				data_day.shift();
console.log(data_day);
				chart_day.load({
					columns: data_day
				});

				var select = i.className.baseVal.toString().split("c3-arc-")[1];
				console.log('select, '+select);
				$('.c3-shape.c3-shape.c3-arc.c3-arc-'+select).css('opacity', 0.5); 
			},
			onmouseover: function (d, i) { 
				console.log(i.className.baseVal.toString().replace(" ","."))
				$('.c3-shape.c3-shape.c3-arc.c3-arc-march').css('opacity', 0.5); 
			},
			//onmouseout: function (d, i) { console.log("onmouseout", d, i); }
		},
		size: {
			height: 350,
			width: 350
		},
		legend: {
			item: {
				onclick: function (d) {
					chart_month.toggle(d)
				}
			}
		},
		bindto: d3.select('#month')
	});
}
// ----------------------------------------------- DEMOGRAPH BAR DATA ---------------------------
function demograph_data(ndx){
	var axis = [];
	var dim = ndx.dimension(function(d){
		if (d.still == 0){
			var i = Math.floor(d.age/181);
			axis[i]=((181*i)+'-'+((i+1)*181));
			return axis[i];
		}else{return "0"}
		
	});
	var nostill = dim.group();
	
	var dim2 = ndx.dimension(function(d){
		if (d.still == 1){
			var i = Math.floor(d.age/181);
			axis[i]=((181*i)+'-'+((i+1)*181));
			return axis[i];
		}else{return "0"}
	});
	
	var still = dim2.group();
	var data = c3Format('demograph', [still, nostill]);
	
	return data;
}
// ------------------------------------------------ DEMOGRAPH BAR DRAW ---------------------------
function draw_demograph(data, ndx){
	chart_demograph = c3.generate({
		data: {
			x: 'x',
			columns: data,
			type: 'bar',
			onclick: function (d, i) {
console.log(d);
			}
		},
		legend: {
			item: {
				onclick: function (d) {
					if (d == "Still"){
						chart_demograph.toggle("No still");
						// refresh chart_year
						var new_data_year = refresh(ndx, "still", "year_demograph");
						var new_year = c3Format('year', new_data_year);
//						new_year.shift();
						chart_year.load({
							columns: new_year
						});
						// refresh chart_month
						var new_data_month = refresh(ndx, "still", "month_demograph");
						var new_month = c3Format('month', new_data_month);
						chart_month.load({
							columns: new_month
						});
						// refresh chart_day
						var new_data_day = refresh(ndx, "still", 'day_demograph');
						var data_day = c3Format('day', new_data_day);
//						data_day.shift();
						chart_day.load({
							columns: data_day
						});
					}else{
						chart_demograph.toggle("Still");
						// refresh chart_year
						var new_data_year = refresh(ndx, "nostill", "year_demograph");
						var new_year = c3Format('year', new_data_year);
//						new_year.shift();
						chart_year.load({
							columns: new_year
						});
						// refresh chart_month
						var new_data_month = refresh(ndx, "nostill", "month_demograph");
						var new_month = c3Format('month', new_data_month);
						chart_month.load({
							columns: new_month
						});
						// refresh chart_day
						var new_data_day = refresh(ndx, "nostill", 'day_demograph');
						var data_day = c3Format('day', new_data_day);
//						data_day.shift();
						chart_day.load({
							columns: data_day
						});
					//	var new_data_month = refresh(ndx, "nostill", "month_demograph");
					//	var new_data_year = refresh(ndx, "nostill", "year_demograph");
					}
				}
			}
		},
		axis: {
			x: {
				type: 'category', 
				tick: {
					rotate: 90,
					multiline: false
				},
				height: 130
			}
		},
		size: {
			height: 350,
			width: 450
		},
		bindto: d3.select('#demograph')
		
	});
}
//------------------------------------------------ DAY PIE DATA ------------------------------------
function dayPie_data(ndx){
	var dim = ndx.dimension(function(d) {
		return d.date.getUTCDate();
	});
	var grp = dim.group().reduceSum(function(d) {
		return d.one;
	});
	var day_data = c3Format('day', grp);
	return day_data;
}
//------------------------------------------------ DAY PIE DRAW ------------------------------------
function draw_day(data, ndx){
	chart_day = c3.generate({
		data: {
			columns: data,
			type : 'bar',
			onclick: function (d, i) {
				// refresh chart_year
				var new_data_year = refresh(ndx, d.name, 'year_day');
				var data_year = c3Format('year', new_data_year);
//				data_year.shift();
				chart_year.load({
					columns: data_year
				});
				// refresh chart_demograph
				var new_data_demograph = refresh(ndx, d.name, 'demograph_day');
				var data_demograph = c3Format('demograph', new_data_demograph);
				chart_demograph.load({
					columns: data_demograph	
				});
				// refresh chart_month
				var new_data_month = refresh(ndx, d.name, 'month_day');
				var data_month = c3Format('month', new_data_month);
				chart_month.load({
					columns: data_month
				}); 
			}
/*			onmouseover: function (d, i) { 
				console.log(i.className.baseVal.toString().replace(" ","."))
				$('.c3-shape.c3-shape.c3-arc.c3-arc-march').css('opacity', 0.5); 
			},*/
			//onmouseout: function (d, i) { console.log("onmouseout", d, i); }
		},
		size: {
			height: 350,
			width: 450
		},
		legend: {
			item: {
				onclick: function (d) {
					chart_day.toggle(d)
				}
			}
		},
		tooltip: {
			grouped: false,
			format: {
				title: function () {return 'Day';}
			}
		},
		bindto: d3.select('#day')
	});
}
// ----------------------------------------------- CFFORMAT ------------------------------------
// Valid format for crossfilter.js
function cfFormat(d){
    var array = [];
    var keys = [];
    var value = [];
    $.each(d, function(key, val){
        keys.push(key);
        value.push(val);
    });
    for (var i=0; i<value[0].length; i++){
        var data = {};
        for (var j=0; j<keys.length; j++){
            data[keys[j]] = value[j][i];
        }
        array.push(data);
    }
    return array;
}
// --------------------------------------------------- C3 FORMAT ------------------------------------------
// Valid format for c3, type is the type of chart and d is the data.
function c3Format(type, d){
	var result = [];
	if (type == 'demograph'){
		var x = ['x'];
		var d1 = ['No Still'];
		var d2 = ['Still'];
		var data1 = d[0].top(Infinity);
		$.each(data1, function(index, d0){
			var i = d0.key.split("-")[0]/181;
			if (d0.key != "0"){
				x[i+1] = d0.key;
				d2[i+1] = d0.value;
			}
		});
		var data2 = d[1].top(Infinity);
		$.each(data2, function(index, d0){
			var i = d0.key.split("-")[0]/181;
			if (d0.key != "0"){
				x[i+1] = d0.key;
				d1[i+1] = d0.value;
			}
		});

		for(var i=0; i<x.length; i++){
			if (d1[i] == undefined){
				d1[i] = 0;
			}
			if (x[1] == undefined){
				x[1] = "0-181";
			}else{
				if (x[i] == undefined){
					var val = (i-1)*181+'-'+(i+2)*181;
					x[i] = val;
				}
			}
			if (d2[i] == undefined){
				d2[i] = 0;
			}
		}
		result.push(x);
		result.push(d1);
		result.push(d2);
//console.log(result);
	}else{
		var data = d.top(Infinity);
		if ((type == 'year') || (type == 'day')){
			$.each(data, function(index, d){
				if ((d.key != '0') || (d.key != '0000')){
					result.push([d.key.toString(), d.value]);
				}
			});
//console.log(result);
		}else if (type == 'month'){
			//console.log(data);
			$.each(data, function(index, d){
				if (d.key == 1){
					result[d.key-1] = ['january', d.value];
				}else if (d.key == 2){
					result[d.key-1] = ['february', d.value];
				}else if (d.key == 3){
					result[d.key-1] = ['march', d.value];
				}else if (d.key == 4){
					result[d.key-1] = ['april', d.value];
				}else if (d.key == 5){
					result[d.key-1] = ['may', d.value];
				}else if (d.key == 6){
					result[d.key-1] = ['june', d.value];
				}else if (d.key == 7){
					result[d.key-1] = ['july', d.value];
				}else if (d.key == 8){
					result[d.key-1] = ['august', d.value];
				}else if (d.key == 9){
					result[d.key-1] = ['september', d.value];
				}else if (d.key == 10){
					result[d.key-1] = ['october', d.value];
				}else if (d.key == 11){
					result[d.key-1] = ['november', d.value];
				}else if (d.key == 12){
					result[d.key-1] = ['december', d.value];
				}
			});
		}
	}
	//console.log(result)
    return result;
}
// ------------------------------------------- BIRH AND AGING ------------------------------------
// Combine two JSON file into one
function birAgin(d1, d2){
	var value1 = [];
	var value2 = [];
	var still = [];
	var nostill = [];
	$.each(d1, function(key, val){
		if (key == 'id'){
			value1.push(val);
		}
	});
	$.each(d2, function(key, val){
		if (key == 'id'){
			value2.push(val);
		}
	});
	for (var i=0; i<value1[0].length; i++){
		var yes = 0;
		var no = 1;
		if(value2[0].indexOf(value1[0][i]) != -1){
			yes = 1;
			no = 0;
		}
		still.push(yes);
		nostill.push(no);
	}
	d1['still'] = still;
	d1['nostill'] = nostill;
	return d1
}

// --------------------------------------REFRESH -------------------------------
// Update data after click
function refresh(data, selectData, opt){
	var result;

	if (opt == 'month_year'){
		console.log('monthPie '+selectData);
		var dim = data.dimension(function(d){
			if (d.date.getFullYear() == selectData){
				return d.date.getMonth()+1;
			}else{
				return -1;
			}
		});
		var grp = dim.group().reduceSum(function(d) {
			return d.one;
		});
		result = grp;
		//console.log(result.grp.top(Infinity))
	}else if (opt == 'demograph_year'){
		var axis = [];
		var dim = data.dimension(function(d){
			if ((d.still == 0) && (d.date.getFullYear() == selectData)){
				var i = Math.floor(d.age/181);
				axis[i]=((181*i)+'-'+((i+1)*181));
				return axis[i];
			}else{return "0"}

		});
		var nostill = dim.group();

		var dim2 = data.dimension(function(d){
			if ((d.still == 1) && (d.date.getFullYear() == selectData)){
				var i = Math.floor(d.age/181);
				axis[i]=((181*i)+'-'+((i+1)*181));
				return axis[i];
			}else{return "0"}
		});

		var still = dim2.group();
		result = [still, nostill];
	}else if (opt == 'day_year'){
		var dim = data.dimension(function(d){
			if (d.date.getFullYear() == selectData){
				return d.date.getUTCDate();
			}else{
				return -1;
			}
		});
		var grp = dim.group().reduceSum(function(d) {
			return d.one;
		});
		result = grp;
	}else if (opt == 'year_month'){
		console.log('year_Month '+selectData);
		var month = monthToNum(selectData);
		var dim = data.dimension(function(d){
			if (d.date.getMonth() == month){
				//console.log('a');
				return d.date.getFullYear();
			}else{
				return 0000;
			}
		});
		var grp = dim.group().reduceSum(function(d) {
			return d.one;
		});
		result = grp;
	}else if (opt == 'demograph_month'){
		var month = monthToNum(selectData);
		var axis = [];
		var dim = data.dimension(function(d){
			if ((d.still == 0) && (d.date.getMonth() == month)){
				var i = Math.floor(d.age/181);
				axis[i]=((181*i)+'-'+((i+1)*181));
				return axis[i];
			}else{return "0"}

		});
		var nostill = dim.group();

		var dim2 = data.dimension(function(d){
			if ((d.still == 1) && (d.date.getMonth() == month)){
				var i = Math.floor(d.age/181);
				axis[i]=((181*i)+'-'+((i+1)*181));
				return axis[i];
			}else{return "0"}
		});

		var still = dim2.group();
		result = [still, nostill];
	}else if(opt == "day_month"){
		var month = monthToNum(selectData);
		var dim = data.dimension(function(d){
			if (d.date.getMonth() == month){
				//console.log('a');
				return d.date.getUTCDate();
			}else{
				return 0000;
			}
		});
		var grp = dim.group().reduceSum(function(d) {
			return d.one;
		});
		result = grp;
	}else if(opt == "month_demograph"){
		var dim = data.dimension(function(d){
			if((selectData == "still")&&(d.still == 1)){
				return d.date.getMonth()+1;
			}else if ((selectData == "nostill") && (d.still == 0)){
				return d.date.getMonth()+1;
			}else{return 0000;}
		});
		var grp = dim.group().reduceSum(function(d){
			return d.one;
		});
		result = grp;
	}else if(opt == "year_demograph"){
		var dim = data.dimension(function(d){
			if((selectData == "still")&&(d.still == 1)){
				return d.date.getFullYear();
			}else if ((selectData == "nostill") && (d.still == 0)){
				return d.date.getFullYear();
			}else{return 0000;}
		});
		var grp = dim.group().reduceSum(function(d){
			return d.one;
		});
		result = grp;
	}else if(opt == 'day_demograph'){
		var dim = data.dimension(function(d){
			if((selectData == "still")&&(d.still == 1)){
				return d.date.getUTCDate();
			}else if ((selectData == "nostill") && (d.still == 0)){
				return d.date.getUTCDate();
			}else{return 0000;}
		});
		var grp = dim.group().reduceSum(function(d){
			return d.one;
		});
		result = grp;
	}else if (opt == 'year_day'){
		var dim = data.dimension(function(d){
			if (d.date.getUTCDate() == selectData){
				//console.log('a');
				return d.date.getFullYear();
			}else{
				return 0000;
			}
		});
		var grp = dim.group().reduceSum(function(d) {
			return d.one;
		});
		result = grp;
	}else if (opt == 'month_day'){
		var dim = data.dimension(function(d){
			if (d.date.getUTCDate() == selectData){
				return d.date.getMonth()+1;
			}else{
				return -1;
			}
		});
		var grp = dim.group().reduceSum(function(d) {
			return d.one;
		});
		result = grp;
	}else if (opt == 'demograph_day'){
		var axis = [];
		var dim = data.dimension(function(d){
			if ((d.still == 0) && (d.date.getUTCDate() == selectData)){
				var i = Math.floor(d.age/181);
				axis[i]=((181*i)+'-'+((i+1)*181));
				return axis[i];
			}else{return "0"}

		});
		var nostill = dim.group();

		var dim2 = data.dimension(function(d){
			if ((d.still == 1) && (d.date.getUTCDate() == selectData)){
				var i = Math.floor(d.age/181);
				axis[i]=((181*i)+'-'+((i+1)*181));
				return axis[i];
			}else{return "0"}
		});

		var still = dim2.group();
		result = [still, nostill];
	}
	//console.log('return refresh');
	return result;
}
// Change the name month to number
function monthToNum(selectData){
	var month;
	if (selectData == 'january'){
		month = 0;
	}else if (selectData == 'february'){
		month = 1;
	}else if (selectData == 'november'){
		month = 10;
	}else if (selectData == 'march'){
		month = 2;
	}else if (selectData == 'april'){
		month = 3;
	}else if (selectData == 'may'){
		month = 4;
	}else if (selectData == 'june'){
		month = 5;
	}else if (selectData == 'july'){
		month = 6;
	}else if (selectData == 'august'){
		month = 7;
	}else if (selectData == 'september'){
		month = 8;
	}else if (selectData == 'october'){
		month = 9;
	}else if (selectData == 'december'){
		month = 11;
	}
	return month;
}
//--------------------------------- RESET ----------------------------------------------
// Return original data
function reset(){
	var year_data = yearBar_data(originalNdx);
	chart_year.load({
		columns: year_data
	});
	var month_data = monthPie_data(originalNdx);
	chart_month.load({
		columns: month_data
	});
	var demogra_data = demograph_data(originalNdx);
	chart_demograph.load({
		columns:demogra_data
	});
	var days_data = dayPie_data(originalNdx);
	chart_day.load({
		columns:day_data
	});
}
