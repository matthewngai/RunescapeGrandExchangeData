var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var Button = ReactBootstrap.Button;
var MenuItem = ReactBootstrap.MenuItem;
var SplitButton = ReactBootstrap.SplitButton;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var FormGroup = ReactBootstrap.FormGroup;
var Radio = ReactBootstrap.Radio;

var App = React.createClass({
	render: function() {
		return (
			<div>
				<Header />
				<DateRange />
				<Graph />
			</div>
		)
	}
});

var Graph = React.createClass({
	componentDidMount: function() {

	},
	componentDidUpdate: function() {

	},
	drawChart: function(dataPoints) {


	},
	getDOMNode: function() {
		return React.findDOMNode(this);
	},
	getGraphState: function() {
		return {
			data: this.props.data,
			history: this.props.history
		}
	},
	render: function() {
		return (
			<div>
			</div>
		);
	}
});

var Header = React.createClass({
	render: function() {
		return (
			<div className="header">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-4 header-banner">
							<h1>Runescape Grand Exchange Data</h1>
						</div>
						<div className="col-md-8">
							<SearchModule />
						</div>
					</div>
				</div>
			</div>

		);
	}
});

var DateRange =  React.createClass({
	getInitialState: function() {
		return {
			value: '1 Month'
		}
	},

	change: function(event) {
		console.log(event);
		var timeInterval = ['1 Month', '3 Months', '6 Months'];
		this.setState({value: timeInterval[event - 1]});
	},

	render: function() {
		// return (
		// 	<div>
		// 		<SplitButton bsStyle="warning" title={this.state.value} id={`split-button-basic-${1}`} onSelect={this.change}>
		// 		  <MenuItem eventKey="1">1 Month</MenuItem>
		// 		  <MenuItem eventKey="2">3 Months</MenuItem>
		// 		  <MenuItem eventKey="3">6 Months</MenuItem>
		// 		</SplitButton>
		// 	</div>
		// )
		return null;
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
			displayResults : null
		}
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
							<div className="item-tile" key={item.id} id={item.id} onClick={that.onItemClick.bind(that, item.id)} onMouseOver={that.onMouseOver.bind(that, item.id)}>
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
			var listItems = searchResults.map(function(item) {
			  return (
				<div className="item-tile" key={item.id} id={item.id} onClick={that.onItemClick.bind(that, item.id)} onMouseOver={that.onMouseOver.bind(that, item.id)}>
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
	onBlur: function() {
		//close dropdown
		// $('#autocomplete').hide();
	},
	onSubmit: function() {

	},

	onItemClick: function(id) {

		$('#autocomplete').hide();	//hide search bar
		var searchQuery = "/item/" + id + "/" + "graph";
		this.xhr = $.ajax({
			dataType: 'json',
			url: searchQuery,
			cache: false
		}).done(function(data) {
			console.log(data);
			d3.select("svg").remove();
			var dataSet = data;


  var margin = {top: 30, right: 20, bottom: 30, left: 50};
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

//scale axis accordingly and set ticks
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(7);

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
	console.log(error);
	console.log(dataSet);
  var day = dataSet.daily;
  var avg = dataSet.average;
    //daily
    var keys = Object.keys(day);
    var vals = Object.keys(day).map(function (key) { return day[key]; });
    var points = [];
    for (var i = 0; i < keys.length; i++) {
      points.push({x: keys[i], y: vals[i]});
    }

    //monthly average
    var points_avg = [];
    var keys_avg = Object.keys(avg);
    var vals_avg = Object.keys(avg).map(function (key) { return avg[key]; });
    for (var i = 0; i < keys.length; i++) {
      points_avg.push({x: keys_avg[i], y: vals_avg[i]});
    } 

    x.domain(d3.extent(keys));
    y.domain([0, d3.max(vals)]);

        svg.append("path")
          .datum(points)
          .attr("class", "area")
          .style("fill", "yellow")
          .style("opacity", 0.2)
          .attr("d", area);

        svg.append("path")
            .attr("class", "line")
            .style("stroke", "yellow")
            .attr("d", line(points));

        svg.append("path")
          .datum(points_avg)
          .attr("class", "area")
          .style("fill", "grey")
          .attr("d", area)
          .style("opacity", 0.2);

        svg.append("path")
            .attr("class", "line")
            .style("stroke", "grey")
            .attr("d", line(points_avg));


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
        .style("stroke", "white")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style("stroke", "white")
        .call(yAxis);


});



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

