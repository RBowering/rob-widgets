var React = require("react");
var ReactDOM = require("react-dom");
var MainNav = require("../components/nav/mainNav");
var WidgetMenu = require("../components/nav/widgetMenu");
var Jumbotron = require("react-bootstrap").Jumbotron;
var Grid = require("react-bootstrap").Grid;
var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;


var Home = React.createClass({
    render: function () {
        return (
            <div>
                <MainNav/>
                <WidgetMenu/>
                <Grid>
                    <Row>
                        <Col md={12}>
                            <Jumbotron>
                                <h1>Widget Test</h1>
                                <p>This is a simple proof of concept of widgets that can be moved around the screen at the user's leisure. Click the red + button to get started.</p>
                            </Jumbotron>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
});

ReactDOM.render(
    <Home/>,
    document.getElementById('content')
);