var React = require('react');
var ReactDOM = require('react-dom');
var Widget = require('../widget/widget');
var OverWatchOpen = require("../embed/twitch/overwatchopen");
var ButtonGroup = require("react-bootstrap").ButtonGroup;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;
var FormControl = require("react-bootstrap").FormControl;
var $ = require('jquery');
var TopStreams = require('../embed/twitch/topStreams');
var Guid = require("../../helpers/guid");

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var AddWidgetButton = React.createClass({
    propTypes: {
        changeMenuCallback: React.PropTypes.func
    },
    changeMenu: function () {
        this.props.changeMenuCallback(2);
    },
    render: function () {
        return (
            <button onClick={this.changeMenu} type="button" className="addWidget-button"><span className="addWidget-text">+</span></button>
        )
    }
});

var SelectWidgetMenu = React.createClass({
    propTypes: {
        changeMenuCallback: React.PropTypes.func
    },
    goBack: function () {
        this.props.changeMenuCallback(1);
    },
    createDOMElement: function () {
        // Make a unique id so we can create a new element and not collide with any other ids out there
        var id = Guid();

        // Append the target element to the body
        // TODO: See if there is a react-specific way to do this
        $('body').append('<div id="' + id + '"></div>');

        return id;
    },
    openStream: function () {
        var id = this.createDOMElement();

        ReactDOM.render(
            <Widget initialX={100} initialY={300} title="Overwatch Open">
                <OverWatchOpen/>
            </Widget>,
            document.getElementById(id));

        // Go back to the add widget menu
        this.goBack();
    },
    addStickyNote: function () {
        var id = this.createDOMElement();

        ReactDOM.render(
            <Widget initialX={100} initialY={200} title="Sticky Note">
                <FormControl componentClass="textarea" placeholder="..."/>
            </Widget>,
            document.getElementById(id));

        // Go back to the add widget menu
        this.goBack();
    },
    openTwitchStreams: function () {
        var id = this.createDOMElement();

        ReactDOM.render(
            <Widget initialX={100} initialY={100} title="Top 10 Overwatch Streams">
                <TopStreams/>
            </Widget>,
            document.getElementById(id)
        );

        // Go back to the add widget menu
        this.goBack();
    },
    render: function () {
        return (
            <ButtonGroup vertical>
                <Button onClick={this.openTwitchStreams}>Top 10 Overwatch Streams</Button>
                <Button onClick={this.openStream}>Overwatch Open</Button>
                <Button onClick={this.addStickyNote}>Sticky Note</Button>
                <Button onClick={this.goBack}><Glyphicon glyph="arrow-left"/></Button>
            </ButtonGroup>
        )
    }
});

var WidgetMenu = React.createClass({
    getInitialState: function () {
        return {
            menuState: 1
        };
    },
    changeMenu: function (state) {
        this.setState({
            menuState: state
        });
    },
    getMenuContent: function () {
        switch (this.state.menuState)
        {
            case 1:
                return <AddWidgetButton changeMenuCallback={this.changeMenu}/>;
                break;
            case 2:
                return <SelectWidgetMenu changeMenuCallback={this.changeMenu}/>;
                break;
            default:
                return <AddWidgetButton changeMenuCallback={this.changeMenu}/>;
                break;
        }
    },
    render: function () {
       return (
           <div className="widgetMenu-container">
               {this.getMenuContent()}
           </div>
       )
    }
});

module.exports = WidgetMenu;

