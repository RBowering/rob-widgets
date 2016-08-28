var React = require('react');
var ReactDOM = require('react-dom');
var Panel = require("react-bootstrap").Panel;
var $ = require("jquery");


var WidgetContainer = React.createClass({
    propTypes: {
        // Our initial X and Y position
        initialX: React.PropTypes.number,
        initialY: React.PropTypes.number,
        title: React.PropTypes.string
    },
    getInitialState: function () {
        return {

            // Put the widget in the top left corner to start with
            // TODO: Make this initialize better (either off a property or intelligently
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
        }

    },

    // TODO: Need to bind this in a way where ti doesn't collide with other components
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
            }
        });

    },
    stopDrag: function (e) {
        this.setState({dragging: false});
    },

    // TODO: Remove placeholder <OverWatchOpen> tag in place of the component's child
    // TODO: Get the mouse events on just the header
    render: function () {
        return (
            <div style={this.state.styles} onMouseDown={this.startDrag} onMouseUp={this.stopDrag} onMouseMove={this.actuateMove} className="widgetContainer">
                <Panel header={this.props.title}>
                    {this.props.children}
                </Panel>

            </div>
        )
    }
});

module.exports = WidgetContainer;