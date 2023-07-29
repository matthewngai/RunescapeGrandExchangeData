var ButtonGroup = ReactBootstrap.ButtonGroup;
var DropdownButton = ReactBootstrap.DropdownButton;
var Button = ReactBootstrap.Button;
var MenuItem = ReactBootstrap.MenuItem;
var SplitButton = ReactBootstrap.SplitButton;

var App = React.createClass({
    render: function() {
        return (
            <div>
                <DropdownList />
                <DateRange />
            </div>
        )
    }
});

var DateRange =  React.createClass({
    getInitialState: function() {
        return {
            value: '1 Month'
        }
    },

    change: function(event) {
        var timeInterval = ['1 Month', '3 Months', '6 Months'];
        this.setState({value: timeInterval[event - 1]});
    },

    render: function() {
        return (
            <div>
                <SplitButton bsStyle="warning" title={this.state.value} id={`split-button-basic-${1}`} onSelect={this.change}>
                  <MenuItem eventKey="1">1 Month</MenuItem>
                  <MenuItem eventKey="2">3 Months</MenuItem>
                  <MenuItem eventKey="3">6 Months</MenuItem>
                </SplitButton>
            </div>
        )
    }
});

var DropdownList = React.createClass({
    getInitialState: function() {
        return {
            title: 'Category',
            letterTitle: 'Letter',
            itemTitle: 'Item',
            list: [],
            alphaList: [],
            letterList: [],
            letterItemList: [],
            itemList: [],
            selectedCategory: 0,
            selectedLetter: null,
            selectedItem: null
        }
    },
    getCategory: function(categoryID) {
        var url = 'categories/' + categoryID;
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({alphaList: data.alpha});
                this.createAlphaDropdown();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    },

    getCategoryLetter: function(categoryID, letter) {
        var url = 'categories/' + categoryID + '/' + letter;
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({letterItemList : data.items});
                this.createItemDropdownList();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    },

    createDropdownItems: function() {
        var items = [];
        var catList = [];
        $.getJSON("js/data/categories.json", function(data) {
          $.each(data, function(key, val) {
            items.push(<MenuItem key={parseInt(key)} eventKey={key}>{val}</MenuItem>);
            catList[parseInt(key)] = val;
          });
        });
        this.setState({list: items});
        return items;
    },

    createAlphaDropdown: function() {
        var items = [];
        var itemTitle;
        this.state.alphaList.forEach(function(i) {
            itemTitle = i.letter.toUpperCase() + " (" + i.items + ")";
            items.push(<MenuItem key={i.letter} eventKey={i}>{itemTitle}</MenuItem>);
        });
        this.setState({ letterList: items });
    },

    createItemDropdownList: function() {
        var items = [];
        var itemTitle;
        this.state.letterItemList.forEach(function(i) {
            itemTitle = i.name;
            items.push(<MenuItem key={i.id} eventKey={i}>{itemTitle}</MenuItem>);
        });
        this.setState({ itemList: items});
    },

    change: function(event) {
        this.setState({
            title: this.state.list[event].props.children,
            selectedCategory: event,
            selectedLetter: null,
            selectedItem: null,
            letterTitle : 'Letter'
        });
        this.getCategory(event);
    },

    getLetter: function(event) {    
        this.setState({ 
            letterTitle : event.letter.toUpperCase() + ' (' + event.items + ')',
            selectedLetter: event.letter,
            selectedItem: null,
            itemTitle : 'Item'
        });
        this.getCategoryLetter(this.state.selectedCategory, event.letter);
    },

    getItem: function(event) {
        this.setState({
            itemTitle : event.name,
            selectedItem: event.id
            }, function () {
                //make api call here
        });
        this.getPriceAndGraph(event.id);
    },

    getPriceAndGraph: function(itemID) {
        var priceURL = 'item/' + itemID;
        $.ajax({
            url: priceURL,
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });

        $.ajax({
            url: priceURL + '/graph',
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data); //graph
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    },

    componentDidMount: function() {
        this.createDropdownItems();
    },

    render: function() {
        return (
            <div>
                <ButtonGroup id="bg-vertical-dropdown-1" vertical>
                    <DropdownButton title={this.state.title} id="bg-nested-dropdown dropdown-size-large" onSelect={this.change}>
                    {this.state.list}
                    </DropdownButton>
                    <DropdownButton title={this.state.letterTitle} id="bg-nested-dropdown dropdown-size-large" onSelect={this.getLetter}>
                    {this.state.letterList}
                    </DropdownButton>
                    <DropdownButton title={this.state.itemTitle} id="bg-nested-dropdown dropdown-size-large" onSelect={this.getItem}>
                    {this.state.itemList}
                    </DropdownButton>
                </ButtonGroup>
            </div>
        )
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
