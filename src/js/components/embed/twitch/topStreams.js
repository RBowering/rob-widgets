var React = require('react');
var ReactDOM = require('react-dom');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var $ = require('jquery');
var Widget = require('../../widget/widget');
var TopStreamsStore = require("../../../stores/topStreamsStore");
var TopStreamsActions = require("../../../actions/topStreamsActions");

var TwitchStreamRow = React.createClass({
    propTypes: {
        streamId: React.PropTypes.number
    },
    getInitialState: function () {
        return TopStreamsStore.getStream(this.props.streamId);
    },
    createDOMElement: function () {
        // Append the target element to the body
        $('body').append('<div id="' + this.state.widgetDomId + '"></div>');
    },
    iframe: function () {
        return {
            __html: this.state.iframeSrc
        }
    },
    closeStream: function () {
        TopStreamsActions.closeStream(this.props.streamId);
        // Remove our anchor point
        $("#" + this.state.widgetDomId).remove();
        this.setState({disableOpenButton: false});
    },
    openStream: function () {
        // Create an "anchor point" to initiate the widget at
        this.createDOMElement();

        ReactDOM.render(
            <Widget closeCallback={this.closeStream} initialX={150} initialY={200} title={this.state.streamInfo.channel.status}>
                <div dangerouslySetInnerHTML={this.iframe(this.state.streamInfo.channel.name)}></div>
            </Widget>,
            document.getElementById(this.state.widgetDomId));

        TopStreamsActions.openStream(this.props.streamId);
        this.setState({disableOpenButton: true});
    },
    render: function () {
        // Disable the button if the stream is currently open
        var button = this.state.disableOpenButton ? <Button disabled className="twitchStreamRow-openStreamButton" onClick={this.openStream}>Open Stream</Button> : <Button className="twitchStreamRow-openStreamButton" onClick={this.openStream}>Open Stream</Button>;

        return (
            <Row className="twitchStreamRow">
                <Col md={10}>
                    <img src={this.state.streamInfo.preview.small} className="twitchStreamRow-image"/>

                    {this.state.streamInfo.channel.status}
                </Col>
                <Col md={2}>
                    {button}
                </Col>
            </Row>
        )
    },

    update: function () {
        this.setState(TopStreamsStore.getStream(this.props.streamId));
    }
});

var TopTwitchStreams = React.createClass({
    getInitialState: function () {
        TopStreamsActions.refreshStreams();
        return TopStreamsStore.getState()
    },
    componentDidMount: function () {
        TopStreamsStore.addChangeListener(this.update);
    },
    componentWillUnmount: function () {
        TopStreamsStore.removeChangeListener(this.update);
    },
    getStreams: function () {
        TopStreamsActions.refreshStreams();
    },
    refresh: function () {
        this.getStreams();
    },
    render: function () {
        // If we're loading show a loading message
        // TODO: Make this a spinner
        if (this.state.loading) {
            return (
                <div>Loading...</div>
            )
        }

        // If there's an error, let the user know
        else if (this.state.error) {
            return (
                <div>Whoops... encountered an error while trying to fetch stream list.</div>
            )
        }

        // Make our rows
        var streamRows = this.state.rows.map(function (stream) {
            return <TwitchStreamRow key={stream.streamInfo._id} streamId={stream.streamInfo._id}/>
        });

        // Not loading, no errors, show the list of streams
        return (
            <div className="twitchStreams-wrapper">
                {streamRows}

                <Row>
                    <Col md={12}>
                        <Button className="topTwitchStreams-refreshButton" bsStyle="default" onClick={this.refresh}>
                            <Glyphicon glyph="refresh"/>
                        </Button>
                    </Col>
                </Row>
            </div>
        )
    },

    update: function () {
        this.setState(TopStreamsStore.getState);
    }
});

module.exports = TopTwitchStreams;