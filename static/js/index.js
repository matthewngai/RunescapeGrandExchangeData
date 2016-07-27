// var React    = window.React = require('react'),
//     App;

var App = React.createClass({
    render: function() {
        console.log('hello');
        return (
            <div>
            hello
            </div>
        )
    }
});

// App.start = function () {
//     React.render(<App/>, document.getElementById('app'));
// };

React.render(
    <App />,
    document.getElementById('app')
);
