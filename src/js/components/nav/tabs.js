var React = require("react");
var ReactDOM = require("react-dom");
var Tabs = require("react-bootstrap").Tabs;
var Tab = require("react-bootstrap").Tab;
var Grid = require("react-bootstrap").Grid;
var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;
var Well = require("react-bootstrap").Well;
var Button = require("react-bootstrap").Button;
var WidgetContainer = require("../widget/widgetContainer");
var OverWatchOpen = require("../embed/twitch/overwatchopen");

var TabNav = React.createClass({
    propTypes: {
        // Keep track of our currently selected tab so it can be selected
        tabSelected: React.PropTypes.number
    },
    getInitialState: function () {
        return {"tabSelected": this.props.tabSelected};
    },
    handleSelect(tab) {
        // Update the current tab
        this.setState({tabSelected: tab});
    },
    // TODO: Remove placeholders with something meaningful
    render: function () {
        return (
            <Grid>
                <Row className="tabRow">
                    <Col xs={12} md={12}>
                        <Tabs activeKey={this.state.tabSelected} onSelect={this.handleSelect} id="subNav-tabs">
                            <Tab eventKey={1} title="Test Tab">
                                <Well>Lorem Ipsum</Well>
                            </Tab>
                            <Tab eventKey={2} title="Test tab 2">
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Grid>
        )
    }
});


module.exports=TabNav;