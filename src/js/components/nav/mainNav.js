/**
 * The main navigation bar of the site
 */

var React = require("react");
var Navbar = require("react-bootstrap").Navbar,
    Nav = require("react-bootstrap").Nav,
    NavItem = require("react-bootstrap").NavItem


var MainNav = React.createClass({
    propTypes: {
        // Keep track of what nav item is selected so we can style it differently
        navSelected: React.PropTypes.number
    },
    getInitialState: function () {
        return {"navSelected": this.props.navSelected};
    },
    handleTabSelect(tab) {
        this.setState({tab: tab});
    },

    // TODO: Make more meaningful links
    render: function () {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">React Test Page</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav bsStyle="pills" activeKey={parseInt(this.state.navSelected)} onSelect={this.handleTabSelect}>
                </Nav>
            </Navbar>
        )
    }
});

module.exports=MainNav;