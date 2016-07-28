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
    getCategory: function(categoryID) {
        var url = 'categories/' + categoryID;
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
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
                console.log(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }
        });
    },

    componentDidMount: function() {
        this.getCategory(1);
        this.getCategoryLetter(1, 'a');
    },

    render: function() {
        return (
            <div>
                <ButtonGroup id="bg-vertical-dropdown-1" vertical>
                    <DropdownButton title="Category" id="bg-nested-dropdown dropdown-size-large">
                    </DropdownButton>
                    <DropdownButton title="Letter" id="bg-nested-dropdown dropdown-size-large">
                    </DropdownButton>
                    <DropdownButton title="Item" id="bg-nested-dropdown dropdown-size-large">
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
