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
			</div>
		)
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
		$('#autocomplete').hide();
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
