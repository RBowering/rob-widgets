var React = require("react");
var ReactDOM = require("react-dom");
var MainNav = require("../components/nav/mainNav");
var TabNav = require("../components/nav/tabs");


var Home = React.createClass({
    render: function () {
        return (
            <div>
                <MainNav/>
                <TabNav tabSelected={1}/>
            </div>
        )
    }
});

ReactDOM.render(
    <Home/>,
    document.getElementById('content')
);