var React = require('react');
var ReactDOM = require('react-dom');
var Panel = require("react-bootstrap").Panel;
var $ = require("jquery");
var Row = require("react-bootstrap").Row;
var Col = require("react-bootstrap").Col;
var Glyphicon = require("react-bootstrap").Glyphicon;

const expandedButtonStyles = {
    /* Safari */
    "-webkit-transform": "rotate(-90deg)",

    /* Firefox */
    "-moz-transform": "rotate(-90deg)",

    /* IE */
    "-ms-transform": "rotate(-90deg)",

    /* Opera */
    "-o-transform": "rotate(-90deg)",

    /* Internet Explorer */
    "filter": "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"
};

var WidgetHeader = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        onMouseMove: React.PropTypes.func,
        onMouseDown: React.PropTypes.func,
        onMouseUp: React.PropTypes.func,
        collapseCallback: React.PropTypes.func,
        defaultExpanded: React.PropTypes.bool,
        closeWidgetCallback: React.PropTypes.func
    },
    getInitialState: function () {
        var collapseStyle = this.props.defaultExpanded ? expandedButtonStyles : {};

        return {
            collapseButtonStyle: collapseStyle,
            expanded: this.props.defaultExpanded,
            title: this.props.title,
            rowStyle: {width: "inherit"}
        }
    },
    getDefaultProps: function () {
        return {
            title: "",
            defaultExpanded: false,

            // Initialize empty functions for our events to prevent errors
            onMouseMove: function () {},
            onMouseDown: function () {},
            onMouseUp: function () {},
            collapseCallback: function () {},
            closeWidgetCallback: function () {}
        }
    },
    toggleCollapse: function () {
        this.props.collapseCallback();

        // Keep our current header width after we collapse
        var currentWidth = $(ReactDOM.findDOMNode(this)).innerWidth();


        if (!this.state.expanded) {
            this.setState({
                collapseButtonStyle: expandedButtonStyles,
                expanded: true,
                rowStyle: {
                    width: "inherit"
                }
            });
        }
        else {
            this.setState({
                collapseButtonStyle: {},
                expanded: false,
                rowStyle: {
                    width: currentWidth
                }
            });
        }
    },
    closeWidget: function () {
        this.props.closeWidgetCallback();
    },
    onMouseDown: function (e) {
        this.props.onMouseDown(e);
    },
    stopPropagation: function (e) {
          e.stopPropagation();
    },
    render: function () {
        return (
                <Row style={this.state.rowStyle} onMouseDown={this.onMouseDown} className="widgetHeader">
                    <Col md={7} className="widgetHeader-title">
                        {this.state.title}
                    </Col>
                    <Col md={5} className="widgetHeader-buttonWrapper">
                        <div className="widgetHeader-buttons">
                            <div onMouseDown={this.stopPropagation} onClick={this.toggleCollapse} style={this.state.collapseButtonStyle} className="collapseWidget-button">
                                <Glyphicon glyph="chevron-left"/>
                            </div>
                            <div onMouseDown={this.stopPropagation} className="closeWidget-button">
                                <Glyphicon onClick={this.closeWidget} glyph="remove-sign"/>
                            </div>
                        </div>
                    </Col>
                </Row>
        )
    }
});

// TODO: Add ability to resize the widget window
var WidgetContainer = React.createClass({
    propTypes: {
        // Our initial X and Y position
        initialX: React.PropTypes.number,
        initialY: React.PropTypes.number,

        // Our initial title for the panel heading
        title: React.PropTypes.string,

        // Initial width and height of the widget
        initialWidth: React.PropTypes.string,
        initialHeight: React.PropTypes.string,

        // Whether we should allow the user to resize the widget
        allowResize: React.PropTypes.bool
    },
    getDefaultProps: function () {
        var document = $('document');

        return {
            initialX: document.width / 2,
            initialY: document.height / 2,
            initialWidth: "700px",
            initialHeight: "500px"
        }
    },
    getInitialState: function () {
        return {

            // Initialize the widget styles based off of passed in props
            styles: {
                top: this.props.initialY,
                left: this.props.initialX,
                position: "fixed"
            },

            // Whether we are in a 'dragging' state or not
            dragging: false,

            // Initialize our mouse offset. This will help us track where the container is relative to the mouse
            mouseOffset: {
                top: 0,
                left: 0
            },

            // Current height and width of the
            currentWidth: this.props.initialWidth,
            currentHeight: this.props.initialHeight,

            // The collapse state of the widget
            collapsed: false,

            // Flag to control 'closing' the widget
            closed: false
        }

    },
    toggleCollapse: function () {
        this.setState({
            collapsed: !this.state.collapsed
        });
    },
    actuateMove: function (e) {
      if (this.state.dragging) {

          this.setState({
              styles: {
                  top: e.pageY - this.state.mouseOffset.top,
                  left: e.pageX - this.state.mouseOffset.left,
                  position: "fixed"
              }
          });

      }
    },
    startDrag: function (e) {

        // Get the jQuery object of our container
        var pos = $(ReactDOM.findDOMNode(this)).offset();

        // Update our state
        this.setState({

            // Now we're dragging
            dragging:true,

            // Where is the mouse relative to the container
            mouseOffset: {
                top: e.pageY - pos.top,
                left: e.pageX - pos.left
            },
        });

        // Bind these to the document in case the mouse jumps into another element as its moving
        // TODO: Figure out how to get around the iFrame in OverwatchOpen not propagating the event
        document.addEventListener("mousemove", this.actuateMove);
        document.addEventListener("mouseup", this.stopDrag);

    },
    stopDrag: function (e) {
        // Unbind our drag event listeners
        document.removeEventListener("mousemove", this.actuateMove);
        document.removeEventListener("mouseup", this.stopDrag);

        // Update our state
        this.setState({dragging: false});
    },
    closeWidget: function () {
        // Set the state to closed
        this.setState({closed: true});
    },
    render: function () {
        if (this.state.closed) {
            return null;
        }
        else {
            return (
                <Panel expanded={!this.state.collapsed} eventKey="1" collapsible defaultExpanded={true}
                       header={<WidgetHeader defaultExpanded={true} collapseCallback={this.toggleCollapse}
                                             onMouseDown={this.startDrag} title={this.props.title}
                                             closeWidgetCallback={this.closeWidget}/>}
                       style={this.state.styles} className="widgetContainer">
                    {this.props.children}
                </Panel>
            )
        }
    }
});

module.exports = WidgetContainer;