var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var Button = ReactBootstrap.Button;
var MenuItem = ReactBootstrap.MenuItem;
var SplitButton = ReactBootstrap.SplitButton;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var FormGroup = ReactBootstrap.FormGroup;
var Radio = ReactBootstrap.Radio;

var App = React.createClass({
	getInitialState: function() {
		return {
			selectedInfoTile : null,
			currentDateRange: 2
		}
	},
	componentDidMount: function () {
	    window.addEventListener('mouseup', this.pageClick, false);
	},
	pageClick: function(evt) {
		if ($(evt.target).parents('#autocomplete').length || $(evt.target)[0].id === "searchbox" || $(evt.target)[0].id === "autocomplete") {
		} else {
			$('#autocomplete').hide();
		}
	},
	delegateTile: function(e) {
		this.setState({selectedInfoTile: e});
	},
	changeDateApp: function(e) {
		this.setState({currentDateRange: e});
	},
	render: function() {
		return (
			<div>
				<Header tileToPage={this.delegateTile} dateToHeader={this.state.currentDateRange}/>
				<InfoTile infoTile={this.state.selectedInfoTile} dateToApp={this.changeDateApp}/>
			</div>
		)
	}
});

var Header = React.createClass({
	getInitialState: function() {
		return {
			dateToModule: this.props.dateToHeader
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.dateToHeader !== nextProps.dateToHeader) {
			this.setState({ dateToModule: nextProps.dateToHeader });
		}
	},
	changeTile: function(e) {
		this.props.tileToPage(e);
	},
	render: function() {
		return (
			<div className="header">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-4 header-banner">
							<h1>Runescape Grand Exchange Data</h1>
						</div>
						<div className="col-md-8 header-banner">
							<SearchModule onTileChange={this.changeTile} currentDate={this.state.dateToModule}/>
						</div>
					</div>
				</div>
			</div>

		);
	}
});

var InfoTile = React.createClass({
	getInitialState: function() {
		return {
			infoTile: this.props.infoTile
		}
	},
	changeDate: function(e) {
		this.props.dateToApp(e);
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.infoTile !== nextProps.infoTile) {
			this.setState({ infoTile: nextProps.infoTile });
		}
	},
	render: function() {
		if (this.state.infoTile !== null && this.state.infoTile !== undefined) {
			return (
				<div>
					<div className="tileTable">
						<table>
						  <tbody>
							  <tr>
							    <td><img className="image" src={this.state.infoTile.icon_large} /></td>
							    <td><span>{this.state.infoTile.name}</span>
							     {this.state.infoTile.members=='true' ? <img src="../img/members.png" /> : false}
							    </td>
							  </tr>
							  <tr>
							    <td colSpan="2">Description: {this.state.infoTile.description}</td>
							  </tr>
							  <tr>
							    <td colSpan="2">Type: {this.state.infoTile.type}</td>
							  </tr>
							  <tr>
							    <td colSpan="2">Price: {this.state.infoTile.current.price} coins</td>
							  </tr>
							  <tr>
							    <td colSpan="2">Trend: {this.state.infoTile.current.trend}</td>
							  </tr>
						  </tbody>
						</table>
					</div>
					<DateRange onDateChange={this.changeDate}/>
				</div>
			)
		}
		return null;
	}
});

var DateRange =  React.createClass({
	getInitialState: function() {
		return {
			label: '6 Months',
			value: 2
		}
	},

	change: function(event) {
		this.props.onDateChange(event-1); //pass date up
		var timeInterval = ['1 Month', '3 Months', '6 Months'];
		this.setState({label: timeInterval[event - 1], value: event-1});
	},

	render: function() {
		return (
			<div>
				<div className="date-button">
					<SplitButton bsStyle="warning" title={this.state.label} id={`split-button-basic-${1}`} onSelect={this.change}>
					  <MenuItem eventKey="1">1 Month</MenuItem>
					  <MenuItem eventKey="2">3 Months</MenuItem>
					  <MenuItem eventKey="3">6 Months</MenuItem>
					</SplitButton>
					<span className="label-styling">
						<span className="image-padding"><img className="image-padding" src="../img/yellow.png"/>Daily</span>
						<span className="image-padding"><img className="image-padding" src="../img/gray.png"/>Trend</span>
					</span>
				</div>
			</div>
		)
	}
});

var SearchModule = React.createClass({
	getInitialState: function() {
		this.xhr = null;
		this.pageNumber = 1;

		return {
			selectedItem : null,
			searchQuery: '',
			searchResults: [],
			displayResults : null,
			dateFormat: this.props.currentDate,
			dataResults: null
		}
	},
	componentWillReceiveProps: function(nextProps) {
		if (this.props.currentDate !== nextProps.currentDate) {
			this.setState({ dateFormat: nextProps.currentDate });
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		if (this.state.dataResults !== nextState.dataResults) {
			this.displayGraph(nextState.dataResults, this.state.dateFormat);
		}
		else if (this.state.dateFormat !== nextState.dateFormat) {
			this.displayGraph(this.state.dataResults, nextState.dateFormat);
		}
		return true;
	},
	componentDidMount: function() {
		var that = this;
		$('#autocomplete').on('scroll', function() {
			if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight)	{
				if ($(this)[0].scrollHeight > 0) {
					that.pageNumber++;
					that.xhr = $.ajax({
						dataType: 'json',
						url: 'search/' + $('#searchbox').val() + '/' + that.pageNumber,
						cache: false
					}).done(function(data) {
						var searchResults = data.results;
						var listItems = searchResults.map(function(item) {
						  return (
							<div className="item-tile" key={item.id} id={item.id} onClick={that.onItemClick.bind(that, item)} onMouseOver={that.onMouseOver.bind(that, item.id)}>
							  <span className="pic">
							  	<img className="image" src={item.icon_large} />
							  </span>
							  <span className="description">
							  	<div className="title">{item.name}</div>
							  	<div className="text">{item.description}</div>
							  </span>
							</div>
						  );
						});
						var holdResult = that.state.displayResults;
						holdResult.push(listItems);
						that.setState({displayResults: holdResult});

					}).fail(function(jqXHR, textStatus, errorThrown) {
						console.log(textStatus + errorThrown);
					});
				}
			}
		});
	},
	onInput: function() {
		var value = $('#searchbox').val();
		this.pageNumber = 1;
		//check if value first
		var searchQuery = 'search/' + value;
		this.setState({displayResults: null});
		if(this.xhr && this.xhr.readyState != 4) {
			this.xhr.abort();
			this.xhr = null;
		}
		var that = this;
		this.xhr = $.ajax({
			dataType: 'json',
			url: searchQuery,
			cache: false
		}).done(function(data) {
			var searchResults = data.results;
			var listItems;
			if (searchResults.length) {
				listItems = searchResults.map(function(item) {
				  return (
					<div className="item-tile" key={item.id} id={item.id} onClick={that.onItemClick.bind(that, item)} onMouseOver={that.onMouseOver.bind(that, item.id)}>
					  <span className="pic">
					  	<img className="image" src={item.icon_large} />
					  </span>
					  <span className="description">
					  	<div className="title">{item.name}</div>
					  	<div className="text">{item.description}</div>
					  </span>
					</div>
				  );
				});
			} else {
				listItems = (
					<div className="item-tile" key="none" id="none">
					  <span className="description">
					  	<div className="title">No Results Found</div>
					  </span>
					</div>
				  );		
			}

			that.setState({displayResults: listItems});

		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + errorThrown);
		});          

	},
	onKeyDown: function(e) {
		//navigate up and down dropdown
		var key = e.key;
		if (key.match(/ArrowDown|ArrowUp/)) {
			e.preventDefault();
			console.log(e.key);
		}
	},
	onFocus: function() {
		$('#autocomplete').show();
	},
	onBlur: function(e) {
		//close dropdown
		// $('#autocomplete').hide();
	},
	onSubmit: function() {

	},
	displayGraph: function(data, currentDate) {
		d3.selectAll("svg").remove();	//remove SVG
		var dataSet = data;

		var margin = {top: 50, right: 150, bottom: 50, left: 150};
		var width = 1280 - margin.left - margin.right;
		var height = 720 - margin.top - margin.bottom;

		var svg = d3.select("body")
		    .append("svg")
		        .attr("width", width + margin.left + margin.right)
		        .attr("height", height + margin.top + margin.bottom)
		    .append("g")
		        .attr("transform", 
		              "translate(" + margin.left + "," + margin.top + ")");

		// Set the ranges
		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var area = d3.svg.area()
		    .x(function(d) { return x(d.x); })
		    .y0(height)
		    .y1(function(d) { return y(d.y); });
		//plot lines
		var line = d3.svg.line() 
		    .x(function(d) { return x(d.x); })
		    .y(function(d) { return y(d.y); });

		// Define the div for the tooltip
		var div = d3.select("body").append("div")	
		    .attr("class", "tooltip")				
		    .style("opacity", 0);

		//scale axis accordingly and set ticks
		var xAxis = d3.svg.axis().scale(x)
		    .orient("bottom").ticks(10);

		var yAxis = d3.svg.axis().scale(y)
		    .orient("left").ticks(7)
		    	        .tickFormat(function (d) {
				    var array = ['','k','M','G','T','P'];
				    var i=0;
				    while (d > 1000)
				    {
				        i++;
				        d = d/1000;
				    }
				    d = d+array[i];
				    return d;}
	    		);

		function make_x_axis() {        
		    return d3.svg.axis()
		        .scale(x)
		         .orient("bottom")
		         .ticks(5)
		}

		function make_y_axis() {        
		    return d3.svg.axis()
		        .scale(y)
		        .orient("left")
		        .ticks(5)
		}

		//replaace function with array
		d3.json(dataSet, function(error, data) {
			var day = dataSet.daily;
			var avg = dataSet.average;
		  	var datesArray = [150, 90, 0];	//dates to start at

		    //daily
		    var points = [];
		    var datesRanges = [];
		    var keys = Object.keys(day);
		    var vals = Object.keys(day).map(function (key) { return day[key]; });
		    var valueAvg = Object.keys(avg).map(function (key) { return avg[key]; });
		    vals.push.apply(vals, valueAvg);

		    for (var i = datesArray[currentDate]; i < keys.length; i++) {
		      points.push({x: keys[i], y: vals[i]});
		      datesRanges.push(keys[i]);
		    }

		    //monthly average
		    var points_avg = [];
		    var keys_avg = Object.keys(avg);
		    var vals_avg = Object.keys(avg).map(function (key) { return avg[key]; });

		    for (var i = datesArray[currentDate]; i < keys.length; i++) {
		      points_avg.push({x: keys_avg[i], y: vals_avg[i]});
		    }

		    x.domain(d3.extent(datesRanges));
		    y.domain([0, d3.max(vals)]);

		        svg.append("path")
		          .datum(points)
		          .attr("class", "area")
		          .style("fill", "url(#areaGradient)")
		          .style("opacity", 0.2)
		          .attr("d", area);

		    svg.append("path")
		            .attr("class", "line")
		            .style("stroke", "yellow")
		            .attr("d", line(points));

		    svg.append("path")
		          .datum(points_avg)
		          .attr("class", "area")
		          .style("fill", "url(#grayGradient)")
		          .attr("d", area)
		          .style("opacity", 0.2);

		    svg.append("path")
		            .attr("class", "line")
		            .style("stroke", "grey")
		            .attr("d", line(points_avg));

			var areaGradient = svg.append("defs")
			.append("linearGradient")
			.attr("id","areaGradient")
			.attr("x1", "0%").attr("y1", "0%")
			.attr("x2", "0%").attr("y2", "80%");

			areaGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#ffff66")
			.attr("stop-opacity", 0.6);
			areaGradient.append("stop")
			.attr("offset", "80%")
			.attr("stop-color", "white")
			.attr("stop-opacity", 0);

			var grayGradient = svg.append("defs")
			.append("linearGradient")
			.attr("id","grayGradient")
			.attr("x1", "0%").attr("y1", "0%")
			.attr("x2", "0%").attr("y2", "80%");

			grayGradient.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#d9d9d9")
			.attr("stop-opacity", 0.6);
			grayGradient.append("stop")
			.attr("offset", "80%")
			.attr("stop-color", "white")
			.attr("stop-opacity", 0);

		    // Add the scatterplot
		    var timeFormat = d3.time.format("%d %b %y");
		    var commaFormat = d3.format(',');

		    svg.selectAll("dot")	
		        .data(points)			
		    .enter().append("circle")
		        .attr("r", 3)
		        .style("fill", "yellow")
		        .attr("cx", function(d) { return x(d.x); })
		        .attr("cy", function(d) { return y(d.y); })
		        .on("mouseover", function(d) {
		            div.transition()
		                .duration(200)
		                .style("opacity", .9);		
		            div.html("Daily" + "<br/>" + timeFormat(new Date(parseInt(d.x))) + "<br/>" + commaFormat(d.y))	
		                .style("left", (d3.event.pageX) + "px")
		                .style("top", (d3.event.pageY - 28) + "px");
		            })
		        .on("mouseout", function(d) {
		            div.transition()
		                .duration(500)
		                .style("opacity", 0);
		        });

		    svg.selectAll("dot")	
		        .data(points_avg)			
		    .enter().append("circle")
		        .attr("r", 3)
		        .style("fill", "grey")
		        .attr("cx", function(d) { return x(d.x); })
		        .attr("cy", function(d) { return y(d.y); })
		        .on("mouseover", function(d) {
		            div.transition()
		                .duration(200)
		                .style("opacity", .9);		
		            div.html("Trend" + "<br/>" + timeFormat(new Date(parseInt(d.x))) + "<br/>" + commaFormat(d.y))	
		                .style("left", (d3.event.pageX) + "px")
		                .style("top", (d3.event.pageY - 28) + "px");
		            })
		        .on("mouseout", function(d) {
		            div.transition()
		                .duration(500)
		                .style("opacity", 0);
		        });

			svg.append("g")         
		        .attr("class", "grid")
		        .style("stroke-opacity", 0.1)
		        .attr("transform", "translate(0," + height + ")")
		        .call(make_x_axis()
		            .tickSize(-height, 0, 0)
		            .tickFormat("")
		        );

		    svg.append("g")         
		        .attr("class", "grid")
		        .style("stroke-opacity", 0.1)
		        .call(make_y_axis()
		            .tickSize(-width, 0, 0)
		            .tickFormat("")
		        );

		    svg.append("g")
		        .attr("class", "x axis")
		        .attr("transform", "translate(0, "+height+")")
		        .style("fill", "white")
		        .style("class", "textLabels")
		        .call(xAxis);

		    svg.append("g")
		        .attr("class", "y axis")
		        .style("fill", "white")
		        .style("class", "textLabels")
		        .call(yAxis);

			svg.append("text")
			    .attr("class", "x label")
			    .attr("text-anchor", "middle")
			    .attr("x", width/2)
			    .attr("y", height+(margin.bottom - 7))
			    .style("fill", "white")
				.style("font-size", "16px")
				.style("font-weight", "lighter")
			    .text("Time");

			svg.append("text")
			    .attr("class", "y label")
			    .attr("text-anchor", "middle")
			    .attr("y", 6)
			    .attr("dy", ".75em")
			    .attr("transform", "translate("+ (-margin.left/2) +","+(height/2)+")rotate(-90)")
			    .style("fill", "white")
			    .style("font-size", "16px")
			    .style("font-weight", "lighter")
			    .text("Price (Coins)");
		});

	},
	onItemClick: function(item) {
		var that = this;
		this.props.onTileChange(item); //pass item

		$('#autocomplete').hide();	//hide search bar
		var searchQuery = "/item/" + item.id + "/" + "graph";
		this.xhr = $.ajax({
			dataType: 'json',
			url: searchQuery,
			cache: false
		}).done(function(data) {
			that.setState({dataResults: data});

		}).fail(function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + errorThrown);
		});
	},
	onMouseOver: function(id) {

	},
	render: function() {
		return (
			<div>
				<form id="search_form" onSubmit={this.onSubmit}>
						<div className="top-margin"> 
							<div id="scrollable-dropdown-menu" className="input-group styled-input-group">
									<input id="searchbox"
											type="text"
											className="typeahead form-control"
											placeholder="Search for an item... (e.g. Rune)" 
											onInput={this.onInput}
											onKeyDown={this.onKeyDown}
											onFocus={this.onFocus}
											onBlur={this.onBlur}
									/>
									<span className="input-group-addon">
										<span className="glyphicon glyphicon-search"></span>
									</span>
							</div>
							<div id="autocomplete" className="scrollable-dropdown-menu dropdown-colour rcorners">
								{this.state.displayResults}
							</div>
						</div>
				</form>
			</div>
		);
	}
});

ReactDOM.render(
	<App />,
	document.getElementById('app')
);

