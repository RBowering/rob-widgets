var React = require("react");
var ReactDOM = require("react-dom");
var MainNav = require("../components/nav/mainNav");
var TabNav = require("../components/nav/tabs");
var WidgetMenu = require("../components/nav/widgetMenu");


var Home = React.createClass({
    render: function () {
        return (
            <div>
                <MainNav/>
                <WidgetMenu/>
            </div>
        )
    }
});

ReactDOM.render(
    <Home/>,
    document.getElementById('content')
);