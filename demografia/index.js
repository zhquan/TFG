var aging = {};
var birth = {};
var check = [];
var idBox = [];
var dateBox = {'year': [], 'month': [], 'day': []};
var nameBox = [];
var retainedBox = [];
var companyBox = [];
var tzBox = [];
var andOrBox = {'date': dateBox, 'id': idBox, 'name': nameBox, 'retained': retainedBox, 'company': companyBox, 'tz': tzBox};
var sliderDate = [];
var table;
var idDim;
var retainedDim;
var compDim;
var tzDim;
var nameDim;
var yearDim;
var monthDim;
var dayDim;
var fullDateDim;

var stillNoStillChart;
var monthChart;
var dayChart;
var demographChart;
var yearChart;
var tzCharts;
var companyChart;
var dayOfWeekChart;

$(document).ready(function(){
    stillNoStillChart = dc.pieChart('#still-nostill-chart');
    monthChart = dc.pieChart('#month-chart');
    dayChart = dc.barChart('#day-chart');
    demographChart = dc.rowChart('#demograph-chart');
	yearChart = dc.pieChart('#year-chart');
    tzCharts = dc.rowChart('#time-zone-chart');
	companyChart = dc.rowChart('#company-chart');
	dayOfWeekChart = dc.pieChart('#day-Of-Week');
	table = dc.dataTable('.dc-data-table');
    $.when(
		// Load agin json file
        $.getJSON('its-demographics-aging.json', function (data) {
            aging = data;
        }),
		// Load birth json file
        $.getJSON('its-demographics-birth.json', function (data) {
            birth = data;
        })
    ).done(function(){
		$('#load').hide();
        datas = birAgin(birth['persons'], aging['persons']);
        data = dcFormat(datas);
        var ndx = crossfilter(data);
		var all = ndx.groupAll();

		// Add date for each data
		var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
		var format = dateFormat.parse(birth['date']);
		var initDate = ((new Date(format.getFullYear(), format.getMonth(), format.getUTCDate())-new Date(1970, 0, 0))/(1000*60*60*24))+1;
        data.forEach(function (d) {
		    d.one = 1; // value 1 for each data
			d.day = initDate-d.age;
		    d.date = new Date(1970, 0, d.day);
			if (sliderDate.indexOf(d.day) == -1){
				sliderDate.push(d.day);
			}
		});
/*********************************************************************************************************************************
************************************************* Pie -> retained VS No retained *************************************************
*********************************************************************************************************************************/
		
        var sNsDim = ndx.dimension(function (d) {
            return d.noretained > d.retained ?  'Dropped out': 'Retained';
        });
        var sNsGrp = sNsDim.group();
        stillNoStillChart
            .width(180) // (optional) define chart width, :default = 200
            .height(180) // (optional) define chart height, :default = 200
            .radius(80) // define pie radius
            .dimension(sNsDim) // set dimension
            .group(sNsGrp)
			.label(function (d) {
				if (stillNoStillChart.hasFilter() && !stillNoStillChart.hasFilter(d.key)) { // show %
					return d.key + '(0%)';
				}
				var label = d.key;
				if (all.value()) {
					label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
				}
				return label;
			})
/*********************************************************************************************************************************
*********************************************************** Pie -> Year **********************************************************
*********************************************************************************************************************************/
		yearDim = ndx.dimension(function(d) {
            return d.date.getFullYear();
        });
        var yearGrp = yearDim.group().reduceSum(function(d) {
            return d.one;
        });
        yearChart.width(180)
            .height(180)
            .radius(80)
            .innerRadius(30)
            .dimension(yearDim)
            .group(yearGrp);
/*********************************************************************************************************************************
****************************************************** Pie (Donuts) -> Month *****************************************************
*********************************************************************************************************************************/
        monthDim = ndx.dimension(function(d) {
            return d.date.getMonth()+1;
        });
        var monthGrp = monthDim.group().reduceSum(function(d) {
            return d.one;
        });
        monthChart.width(180)
            .height(180)
            .radius(80)
            .innerRadius(30)
            .dimension(monthDim)
            .group(monthGrp);
/*********************************************************************************************************************************
*************************************************** Pie (Donuts) -> Day of Week **************************************************
*********************************************************************************************************************************/
        var dayOfWeekDim = ndx.dimension(function(d) {
			var name;
			if (d.date.getDay() == 1){
				name = 'Monday';
			} else if (d.date.getDay() == 2){
				name = 'Tuesday';
			} else if (d.date.getDay() == 3){
				name = 'Wednesday';
			} else if (d.date.getDay() == 4){
				name = 'Thursday';
			} else if (d.date.getDay() == 5){
				name = 'Friday';
			} else if (d.date.getDay() == 6){
				name = 'Saturday';
			} else if (d.date.getDay() == 0){
				name = 'Sunday';
			}
            return name;
        });
        var dayOfWeekGrp = dayOfWeekDim.group().reduceSum(function(d) {
            return d.one;
        });
        dayOfWeekChart.width(180)
            .height(180)
            .radius(80)
            .innerRadius(30)
            .dimension(dayOfWeekDim)
            .group(dayOfWeekGrp);
/*********************************************************************************************************************************
*********************************************************** Bar -> Day ***********************************************************
*********************************************************************************************************************************/
        dayDim = ndx.dimension(function(d) {
            return (d.date.getUTCDate());
        });
        var dayGrp = dayDim.group();

        dayChart
            .width(500).height(400)
            .dimension(dayDim)
            .group(dayGrp)
            .x(d3.scale.linear().domain([0,32]))
			.centerBar(true)
//			.elasticX(true)
			.centerBar(true)
			.elasticY(true)
			.brushOn(true)
			.renderHorizontalGridLines(true)
			.margins({top: 0, right: 50, bottom: 20, left: 40});
        dayChart.xAxis().tickFormat(function(d) {return d});
        dayChart.yAxis().ticks(15);
/*********************************************************************************************************************************
********************************************************* Row -> Demograph *******************************************************
*********************************************************************************************************************************/
		var axisY = [];
		var demoDim = ndx.dimension(function(d){
			var i = Math.floor(d.age/181);
			axisY[i]=((181*i)+'-'+((i+1)*181));
			return axisY[i];
		})
		var demoGrp = demoDim.group();
		demographChart
			.width(500).height(400)
			.margins({top: 0, right: 50, bottom: 20, left: 40})
			.elasticX(true)
			.dimension(demoDim)
			.group(demoGrp)
			.elasticX(true)
			.ordering(function(d) {
				return -d.key.split('-')[0];
			})
			.title(function(d) { return d.key+' -> '+d.value})

/*********************************************************************************************************************************
******************************************************** Row -> Time Zone ********************************************************
*********************************************************************************************************************************/
		tzDim = ndx.dimension(function(d) {
            return d.TZ;
        });
        var tzGrp = tzDim.group().reduceSum(function(d) {
            return d.one;
        });
        tzCharts.width(500).height(400)
			.margins({top: 0, right: 50, bottom: 20, left: 40})
			.elasticX(true)
			.dimension(tzDim)
			.group(tzGrp)
			.elasticX(true)
			.ordering(function(d) {
				return d.key;
			})
			.title(function(d) { return d.key+' -> '+d.value})

/*********************************************************************************************************************************
********************************************************* Row -> Company *********************************************************
*********************************************************************************************************************************/
		compDim = ndx.dimension(function(d) {
			return d.company;
        });
		var compGrp = compDim.group().reduceSum(function(d){
			return d.one;
		});
		companyChart
			.width(500).height(400)
			.margins({top: 0, right: 50, bottom: 20, left: 40})
			.elasticX(true)
			.dimension(compDim)
			.group(compGrp)
			.elasticX(true)
			.ordering(function(d) {
				return d.key;
			})
			.title(function(d) { return d.key+' -> '+d.value})
// ---------------------------- Reset All charts and dataTable -------------------------------------
        dc.dataCount('.dc-data-count')
            .dimension(ndx)
            .group(all)
			.html({
            some:'<strong>%filter-count</strong> developer shows from a total for <strong>%total-count</strong> developers' +
                ' | <a onclick="resetAll()">Show all</a>',
            all:'<strong>%filter-count</strong> developer shows from a total for <strong>%total-count</strong> developers' +
                ' | <a onclick="resetAll()">Show all</a>'
        });
/*********************************************************************************************************************************
***************************************************** Necesaries Dimensions ******************************************************
**********************************************************************************************************************************/
		idDim = ndx.dimension(function (d) {return d.id});
		retainedDim = ndx.dimension(function(d) {
			return d.retained;
		});
		fullDateDim = ndx.dimension(function(d) {
			return d.date;
		});
/*********************************************************************************************************************************
************************************************************ Calendar ************************************************************
**********************************************************************************************************************************/
		sliderDate.sort(function(a, b){return a-b});
		var from;
		var to;
		$( "#from" ).datepicker({
			changeMonth: true,
			changeYear: true,
			numberOfMonths: 1,
			onClose: function( selectedDate ) {
				$( "#to" ).datepicker( "option", "minDate", selectedDate );
				from = new Date(parseInt(selectedDate.split('/')[2]), parseInt(selectedDate.split('/')[0])-1, parseInt(selectedDate.split('/')[1]));
				var ageFrom = ((from - new Date(1970, 0, 0))/(1000*60*60*24));
				if (to == undefined){
					sliderDate[sliderDate.length-1];
					to = new Date(1970, 0, sliderDate[sliderDate.length-1]);
				}else{
					//to = new Date(parseInt(to.split('/')[2]), parseInt(to.split('/')[0])-1, parseInt(to.split('/')[1]))
					var ageTo = ((to - new Date(1970, 0, 0))/(1000*60*60*24));
				}
				$("#slider-range").slider("option", "values", [ageFrom, ageTo]);
				//from = selectedDate;
				calendarFilter(from, to);
			}
		});
		$( "#to" ).datepicker({
			changeMonth: true,
			changeYear: true,
			numberOfMonths: 1,
			onClose: function( selectedDate ) {
				$( "#from" ).datepicker( "option", "maxDate", selectedDate );
				if (from == undefined){
					sliderDate[0];
					from = new Date(1970, 0, sliderDate[0]);
				}else{
					var ageFrom = ((from - new Date(1970, 0, 0))/(1000*60*60*24));
				}
				to = new Date(parseInt(selectedDate.split('/')[2]), parseInt(selectedDate.split('/')[0])-1, parseInt(selectedDate.split('/')[1]));
				var ageTo = ((to - new Date(1970, 0, 0))/(1000*60*60*24))+1;
				$("#slider-range").slider("option", "values", [Math.floor(ageFrom), Math.floor(ageTo)]);
				//to = selectedDate;
				calendarFilter(from, to);
			}
		});
/*********************************************************************************************************************************
************************************************************** Slider ************************************************************
**********************************************************************************************************************************/
		$( "#slider-range" ).slider({
			range: true,
			min: sliderDate[0],
			max: sliderDate[sliderDate.length-1],
			values: [sliderDate[0], sliderDate[sliderDate.length-1]],
			slide: function( event, ui ) {
				var initDate = new Date(1970, 0, ui.values[0]);
				var finalDate = new Date(1970, 0, ui.values[1]);
				var initMonth = initDate.getMonth()+1;
				var finalMonth = finalDate.getMonth()+1;
				var from = initMonth+'/'+initDate.getUTCDate()+'/'+initDate.getFullYear();
				var to = finalMonth+'/'+finalDate.getUTCDate()+'/'+finalDate.getFullYear();
				$('#from').val(from);
				$('#to').val(to);
				calendarFilter(initDate, finalDate);
			}
		});
/*********************************************************************************************************************************
************************************************************ DataTable ***********************************************************
**********************************************************************************************************************************/
        nameDim = ndx.dimension(function (d) {
            return d.name;
        });
        table
            .dimension(nameDim)
            .group(function (d) {return "";})
            .size(20)
            .columns([
                {
                    label: 'Date <img src="arrow.png" height="10" width="10" onclick="sortB('+"'date'"+')">',
                    format: function (d) {
            			var formato = d3.format('02d');
						return '<a>'+d.date.getFullYear() + ' / ' + formato((d.date.getMonth() + 1)) + ' / ' + formato(d.date.getUTCDate())+'</a>';
                    }
                },
				{
					label: '<button onclick="columnFilter('+"'date'"+')">Filter</button>',
					format: function (d){
						var format = d3.format('02d');
						return '<input class="checkDate" type="checkbox" id="'+d.date.getFullYear()+'-'+d.date.getMonth()+'-'+d.date.getUTCDate()+'_'+d.id+'">';
					}
				},
                {
					label: 'Id <img src="arrow.png" height="10" width="10" onclick="sortB('+"'id'"+')">',
					format: function (d) {
						return d.id;
					}
				},
				{
					label: '<button onclick="columnFilter('+"'id'"+')">Filter</button>',
					format: function (d) {
						return '<input class="checkId" type="checkbox" id="'+d.id+'">';
					}
				},
                {
					label: 'Name <img src="arrow.png" height="10" width="10" onclick="sortB('+"'name'"+')">',
					format: function (d) {
						return '<a>'+d.name+'</a>';
					}
				},
				{
					label: '<a class="retained">Retention</a> <img src="arrow.png" height="10" width="10" onclick="sortB('+"'retained'"+')">',
					format: function (d) {
						if (d.retained == 1){
							return '<a>Retained</a>';
						}else{
							return '<a>Dropped out</a>';
						}
					}
				},
				{
					label: '<button onclick="columnFilter('+"'retained'"+')">Filter</button>',
					format: function (d) {
						return '<input class="checkRetained" type="checkbox" id="'+d.retained+'_'+d.id+'r">';
					}
				},
				{
					label: '<a class="company">Company</a> <img src="arrow.png" height="10" width="10" onclick="sortB('+"'company'"+')">',
					format: function (d) {
						return '<a>'+d.company+'</a>';
					}
				},
				{
					label: '<button onclick="columnFilter('+"'company'"+')">Filter</button>',
					format: function (d) {
						return '<input class="checkCompany" type="checkbox" id="'+d.company+'_'+d.id+'">';	
					} 
				},
				{
					label: '<a class="tz">TZ</a> <img src="arrow.png" height="10" width="10" onclick="sortB('+"'tz'"+')">',
					format: function (d) {
						return '<a>'+d.TZ+'</a>';
					}
				},
				{
					label: '<button onclick="columnFilter('+"'tz'"+')">Filter</button>',
					format: function (d) {
						return '<input class="checkTZ" type="checkbox" id="'+d.TZ+'_'+d.id+'">';
					}
				}
            ])
            .sortBy(function (d) {
                return d.date;
            })
            .order(d3.ascending);

		table.on('renderlet', function(table) {
			table.selectAll('.dc-table-group').classed('info', true);
			// ---------------------------- Click Retained -------------------------------------
			table.selectAll('.dc-table-head .retained').on('click', function(d){
				var html = '';
				$('#pop').show();
				closeDate();
				closeProfile();
				html = '<strong>Retained</strong><br>'
				var still = sNsGrp.top(Infinity);
				$.each(still, function(i, d){
					html += '<a onclick="tableFilter('+"'retained', "+"'"+d.key.toString()+"'"+')">' + d.key + ': ' + d.value + '</a><br>';
				});
				$('#pop').html(html+'<button onclick="closePop()">Close</button>');
			});
			// ---------------------------- Click Company -------------------------------------
			table.selectAll('.dc-table-head .company').on('click', function(d){
				var html = '';
				$('#pop').show();
				closeDate();
				closeProfile();
				html = '<strong>Company</strong><br>'
				var comp = compGrp.top(Infinity);
				$.each(comp, function(i, d){
					html += '<a onclick="tableFilter('+"'company', "+"'"+d.key.toString()+"'"+')">' + d.key + ': ' + d.value + '</a><br>';
				});
				$('#pop').html(html+'<button onclick="closePop()">Close</button>');
			});
			// ---------------------------- Click Time Zone -------------------------------------
			table.selectAll('.dc-table-head .tz').on('click', function(d){
				var html = '';
				$('#pop').show();
				closeDate();
				closeProfile();
				html = '<strong>Time Zone</strong><br>'
				var tzs = tzGrp.top(Infinity);
				$.each(tzs, function(i, d){
					html += '<a onclick="tableFilter('+"'tz', "+"'"+d.key.toString()+"'"+')">' + d.key + ': ' + d.value + '</a><br>';
				});
				$('#pop').html(html+'<button onclick="closePop()">Close</button>');
			});
			// ---------------------------- First column, Date -------------------------------------
			table.selectAll(".dc-table-column._0").on("click", function(d){
				var year = d.date.getFullYear();
				var month = d.date.getMonth()+1;
				var day = d.date.getUTCDate();
				$('#show-date').show();
				closePop();
				closeProfile();
				$('#clickYear').html(year);
				$('#clickMonth').html(month);
				$('#clickDay').html(day);
			});
			// ---------------------------- Third column, Name ---------------------------------------
			table.selectAll(".dc-table-column._4").on("click", function(d){
				closeDate();
				closePop();
				clickRow(d.date, d.id, d.name, d.retained, d.TZ, d.company);
			});
			// ---------------------------- Fourth column, retained -------------------------------------
			table.selectAll(".dc-table-column._5").on("click", function(d){
				tableFilter('retained', d.retained);
			});
			// ---------------------------- Fifth column, Company ------------------------------------
			table.selectAll(".dc-table-column._7").on("click", function(d){
				tableFilter('company', d.company);
			});
			// ---------------------------- Sixth column, Time zone ----------------------------------
			table.selectAll(".dc-table-column._9").on("click", function(d){
				tableFilter('tz', d.TZ);
			});
			// ---------------------------- Id, CheckBox ---------------------------------
			$(".checkId").each(function(index, d){
				$('#'+d.id).click(function() {
					if ($(this).is(':checked')) {
						idBox.push(parseInt(d.id));
						andOrBox['id'] = idBox;
					}else{
						var i = idBox.indexOf(d.id);
						idBox.splice(i, 1);
						andOrBox['id'] = idBox;
					}
				});
			});
			// ---------------------------- Date, CheckBox ---------------------------------
			$(".checkDate").each(function(index, d){
				$('#'+d.id).click(function() {
					var year = parseInt(d.id.split('-')[0]);
					var month = parseInt(d.id.split('-')[1])+1;
					var day = parseInt(d.id.split('-')[2].split('_')[0]);
					if ($(this).is(':checked')) {
						dateBox['year'].push(year);
						dateBox['month'].push(month);
						dateBox['day'].push(day);
						andOrBox['date'] = dateBox;
					}else{
						var i = dateBox['year'].indexOf(year);
						dateBox['year'].splice(i, 1);
						var j = dateBox['month'].indexOf(month);	
						dateBox['month'].splice(j, 1);
						var k = dateBox['day'].indexOf(day);
						dateBox['day'].splice(k, 1);
						andOrBox['date'] = dateBox;
					}
				});
			});
			// ---------------------------- Retained, CheckBox ---------------------------------
			$(".checkRetained").each(function(index, d){
				$('#'+d.id).click(function() {
					var retained = parseInt(d.id.split("_")[0]);
					if ($(this).is(':checked')) {
						retainedBox.push(retained);
						andOrBox['retained'] = retainedBox;
					}else{
						var i = retainedBox.indexOf(retained);
						retainedBox.splice(i, 1);
						andOrBox['retained'] = retainedBox;
					}
				});
			});
			// ---------------------------- Company, CheckBox ---------------------------------
			$(".checkCompany").each(function(index, d){
				$('#'+d.id).click(function() {
					var company = d.id.split("_")[0];
					if ($(this).is(':checked')) {
						companyBox.push(company);
						andOrBox['company'] = companyBox;
					}else{
						var i = companyBox.indexOf(company);
						companyBox.splice(i, 1);
						andOrBox['company'] = companyBox;
					}
				});
			});
			// ---------------------------- Time Zone, CheckBox ---------------------------------
			$(".checkTZ").each(function(index, d){
				$('#'+d.id).click(function() {
					var tz = parseInt(d.id.split("_")[0]);
					if ($(this).is(':checked')) {
						tzBox.push(tz);
						andOrBox['tz'] = tzBox;
					}else{
						var i = tzBox.indexOf(tz);
						tzBox.splice(i, 1);
						andOrBox['tz'] = tzBox;
					}
				});
			});
			$(window).bind('scroll', function(){
//console.log($(window).scrollTop()+' = '+($('body').outerHeight() - $(window).innerHeight()))
				if($(this).scrollTop() == ($('body').outerHeight() - $(window).innerHeight())) {
				    var size = table.size();
					var numero = $('.dc-data-count.dc-chart').html().split('<strong>')[1].split('</strong>')[0];
					var total = parseInt(numero);
					if (numero.split(',')[1] != undefined){
						total = parseInt(numero.split(',')[0]+numero.split(',')[1]);
					}
//console.log(size+' '+total)
					if (size < total){
						table.size(size+5);
						dc.redrawAll();
					}
				}
			});
		});
/*********************************************************************************************************************************
*********************************************************** Click Year ***********************************************************
*********************************************************************************************************************************/
		$('#clickYear').on('click', function(){
			var year = document.getElementById('clickYear').innerHTML;
			yearDim.filter(year);
			closeDate();
			dc.redrawAll();
		});
/*********************************************************************************************************************************
********************************************************** Click Month ***********************************************************
*********************************************************************************************************************************/
		$('#clickMonth').on('click', function(){
			var month = document.getElementById('clickMonth').innerHTML;
			table.filterAll();
			monthDim.filter(month);
			closeDate();
			dc.redrawAll();
		});
/*********************************************************************************************************************************
*********************************************************** Click Day ************************************************************
*********************************************************************************************************************************/
		$('#clickDay').on('click', function(){
			var day = document.getElementById('clickDay').innerHTML;
			table.filterAll();
			dayDim.filter(day);
			closeDate();
			dc.redrawAll();
		});
/*********************************************************************************************************************************
********************************************************** Table Search **********************************************************
*********************************************************************************************************************************/
		$("#table-search").on('input',function(){
			text_filter(nameDim, this.value);
			function text_filter(dim, q){
				table.filterAll();
				var re = new RegExp(q,"i")
				if (q != '') {
					dim.filter(function(d) {
						return 0 == d.search(q);
					});
				}else{
					dim.filterAll();
				}
				dc.redrawAll();
			}
		});
        dc.renderAll();
    });
});
/*********************************************************************************************************************************
***************************************************** Valid format for dc.js *****************************************************
*********************************************************************************************************************************/
function dcFormat(d){
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
/*********************************************************************************************************************************
****************************************** Combine two JSON file(Birth, Aging) into one ******************************************
*********************************************************************************************************************************/
function birAgin(d1, d2){
	var value1 = [];
	var value2 = [];
	var still = [];
	var nostill = [];
	var tz = [];
	var companies = ['IBM', 'Oracle', 'Wikipedia', 'Libresoft', 'HP', 'Nebula'];
	var company =  [];
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
		var TZ = Math.floor(Math.random() * (13 + 12) - 12);
		tz.push(TZ);
		var index = Math.floor(Math.random()*6);
		company.push(companies[index]);
		var yes = 0;
		var no = 1;
		if(value2[0].indexOf(value1[0][i]) != -1){
			yes = 1;
			no = 0;
		}
		still.push(yes);
		nostill.push(no);
	}
	d1['TZ'] = tz;
	d1['company'] = company;
	d1['retained'] = still;
	d1['noretained'] = nostill;
	return d1
}
/*********************************************************************************************************************************
************************************************ close profile, "show date" or pop ***********************************************
*********************************************************************************************************************************/
function closeProfile(){
	$('#profile').hide();
}
function closeDate(){
	$('#show-date').hide();
}
function closePop(){
	$('#pop').hide();
}
/*********************************************************************************************************************************
**************************************************** Onclick on the table row ****************************************************
*********************************************************************************************************************************/
function clickRow(date, id, name, retained, TZ, company){
	var aux;
	if (retained == 0){
		aux = "NO";
	}else{
		aux = "YES";
	}
	$('#profile').show();
	$("#profile").html('<strong>Profile</strong><br>Name: '+name+' Id: '+id+'<br>Company: '+company+' Retained: '+aux+'<br>Date: '+date.toString().split("00:00")[0]+' Time Zone: '+TZ+'<br><button onclick="closeProfile()">Close</button>');
}
/*********************************************************************************************************************************
********************************************************** SortBy Click **********************************************************
*********************************************************************************************************************************/
function sortB(d) {
	if (d == 'date'){
		table.sortBy(function (d2){
			return d2.date;
		});
	}else if (d == "id"){
		table.sortBy(function (d2){
			return d2.id;
		});
	}else if (d == "name"){
		table.sortBy(function (d2){
			return d2.name;
		});
	}else if (d == "company"){
		table.sortBy(function (d2){
			return d2.company;
		});
	}else if (d == "tz"){
		table.sortBy(function (d2){
			return d2.TZ;
		});
	}else if (d == "retained"){
		table.sortBy(function(d2){
			return d2.retained;
		});
	}
	dc.redrawAll();
}
/*********************************************************************************************************************************
********************************************************** Filter Click **********************************************************
*********************************************************************************************************************************/
function filterAnd(){
	console.log(andOrBox)
	columnFilter('date');
	idBox = andOrBox['id'];
	columnFilter('id');
	retainedBox = andOrBox['retained'];
	columnFilter('retained');
	companyBox = andOrBox['company'];
	columnFilter('company');
	tzBox = andOrBox['tz'];
	columnFilter('tz');
	andOrBox = {'date': dateBox, 'id': idBox, 'name': nameBox, 'retained': retainedBox, 'company': companyBox, 'tz': tzBox};
}
/*********************************************************************************************************************************
****************************************************** Column Filter Click *******************************************************
*********************************************************************************************************************************/
function columnFilter(type){
//	dc.filterAll();
	table.filterAll();
	var array = [];
	var dim;
	if (type == 'date'){
		array = arrayFilter(dateBox['year']);
		dimFilter(yearDim, array);
		array = arrayFilter(dateBox['month']);
		dimFilter(monthDim, array);
		array = arrayFilter(dateBox['day']);
		dimFilter(dayDim, array);
	} else if (type == 'id'){
		array = idBox;
		dim = idDim;
	} else if (type == 'name'){
		array = nameBox;
		dim = nameDim;
	} else if (type == 'retained'){
		array = arrayFilter(retainedBox);
		if (array.length == 1){
			retainedDim.filter(array[0]);
		}else{
			array = [];
		}
	} else if (type == 'company'){
		dim = compDim;
		array = arrayFilter(companyBox);
	} else if (type == 'tz'){
		dim = tzDim;
		array = arrayFilter(tzBox)
	}
	if ((type != 'retained') && (type != 'date')){
		dimFilter(dim, array);
	}
	dc.redrawAll();
	dateBox = {'year': [], 'month': [], 'day': []};
	idBox = [];
	nameBox = [];
	retainedBox = [];
	companyBox = [];
	tzBox = [];
	check = [];
}
// Filtered repeated entries
function arrayFilter(checked) {
	var array = [];
	for(var i=0; i<checked.length; i++){
		if ((array.length == 0) || (array.indexOf(checked[i]) == -1)){
			array.push(checked[i]);
		}
	}
	return array;
}
// Filters the dimension
function dimFilter(dim, array){
	if (array.length > 0){
		dim.filter(function (d){
			if (array.indexOf(d) != -1){
				return d;
			}
		});
	}
}
/*********************************************************************************************************************************
********************************************************** Table Filter **********************************************************
*********************************************************************************************************************************/
function tableFilter(type, data){
	closePop();
	table.filterAll();
	if (type == 'retained'){
		if (data == 'Yes'){
			retainedDim.filter(1);
		} else if (data == 'No'){
			retainedDim.filter(0);
		} else {
			retainedDim.filter(data);
		}
	}else if (type == 'company'){
		compDim.filter(data);
	}else if (type == 'tz'){
		tzDim.filter(data);
	}
	dc.redrawAll();
}
/*********************************************************************************************************************************
******************************************************** Calendar Filter *********************************************************
*********************************************************************************************************************************/
function calendarFilter(from, to){
	fullDateDim.filter(function (d){
		// FromYear < YEAR < ToYear
		if ((d.getFullYear() > from.getFullYear()) && (d.getFullYear() < to.getFullYear())){
			return d;
		// FromYear = ToYear = YEAR
		} else if ( (d.getFullYear() == from.getFullYear()) && (d.getFullYear() == to.getFullYear()) ){
			// FromMonth < MONTH < ToMonth
			if ( ( d.getMonth() > from.getMonth() ) && ( d.getMonth() < to.getMonth() ) ){
				return d;
			// FromMonth = ToMonth = MONTH
			} else if ( (d.getMonth() == from.getMonth()) && (d.getMonth() == to.getMonth()) ){
				// FromDay <= DAY <= ToDay
				if ( (d.getUTCDate() >= from.getUTCDate()) && (d.getUTCDate() <= to.getUTCDate()) ){
					return d;
				}
			} else if ( (d.getMonth() == from.getMonth()) && (d.getUTCDate() >= from.getUTCDate()) ) {
				return d;
			} else if ( (d.getMonth() == to.getMonth()) && (d.getUTCDate() <= to.getUTCDate()) ) {
				return d;
			}
		// "YEAR = FromYear"
		} else if ( d.getFullYear() == from.getFullYear() ) {
			// Month > FromMonth
			if (d.getMonth > from.getMonth){
				return d;
			// MONTH = FromMonth and Day >= FromDay
			} else if ( (d.getMonth() == from.getMonth()) && (d.getUTCDate() >= from.getUTCDate()) ){
				return d;
			}
		// "YEAR = ToYear"
		} else if ( d.getFullYear() == to.getFullYear() ) {
			// MONTH < ToMonth
			if (d.getMonth() < to.getMonth()) {
				return d;
			// MONTH = ToMonth and DAY < ToDay
			} else if ( (d.getMonth() == to.getMonth()) && (d.getUTCDate() <= to.getUTCDate())) {
				return d;
			}
		}
	});
	dc.redrawAll();
}
/*********************************************************************************************************************************
*********************************************************** Reset All ************************************************************
*********************************************************************************************************************************/
function resetAll(){
	idDim.filterAll();
	retainedDim.filterAll();
	fullDateDim.filterAll();
	dc.filterAll();
	dc.renderAll();
	$('#from').val(" ");
	$('#to').val(" ");
	$("#slider-range").slider("option", "values", [sliderDate[0], sliderDate[sliderDate.length-1]]);
}
