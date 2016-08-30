// TODO: Make this find a list of streams based off a dynamic game name

var React = require('react');
var ReactDOM = require('react-dom');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var $ = require('jquery');
var WidgetContainer = require('../../widget/widgetContainer');

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

var iframeTemplate = '<iframe src="http://player.twitch.tv/?channel={CHANNEL}" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>';

var TwitchStreamRow = React.createClass({
    propTypes: {
        streamInfo: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            disableOpenButton: false
        };
    },
    createDOMElement: function () {
        // Make a unique id so we can create a new element and not collide with any other ids out there
        var id = guid();

        // Append the target element to the body
        // TODO: See if there is a react-specific way to do this
        $('body').append('<div id="' + id + '"></div>');

        return id;
    },
    iframe: function (channel) {
        return {
            __html: iframeTemplate.replace("{CHANNEL}", channel)
        }
    },
    enableOpenStreamButton: function () {
        this.setState({
            disableOpenButton: false
        }) ;
    },
    openStream: function () {
        var id = this.createDOMElement();

        ReactDOM.render(
            <WidgetContainer closeCallback={this.enableOpenStreamButton} initialX={150} initialY={200} title={this.props.streamInfo.channel.status}>
                <div dangerouslySetInnerHTML={this.iframe(this.props.streamInfo.channel.name)}></div>
            </WidgetContainer>,
            document.getElementById(id));

        this.setState({
            disableOpenButton: true
        });
    },
    render: function () {
        // Disable the button if the stream is currently open
        // TODO: Make the disable work after a stream list refresh
        var button = this.state.disableOpenButton ? <Button disabled className="twitchStreamRow-openStreamButton" onClick={this.openStream}>Open Stream</Button> : <Button className="twitchStreamRow-openStreamButton" onClick={this.openStream}>Open Stream</Button>;

        return (
            <Row className="twitchStreamRow">
                <Col md={10}>
                    <img src={this.props.streamInfo.preview.small} className="twitchStreamRow-image"/>

                    {this.props.streamInfo.channel.status}
                </Col>
                <Col md={2}>
                    {button}
                </Col>
            </Row>
        )
    }
});

var TopTwitchStreams = React.createClass({
    getInitialState: function () {
        this.getStreams();
        return {
            streams: {},
            error: false,
            loading: true
        };
    },
    getStreams: function () {
        // Get our stream list then set the state accordingly
        var innerThis = this;
        $.ajax("https://api.twitch.tv/kraken/streams?game=Overwatch&limit=10", {
            success: function(resp) {
                innerThis.setState({
                    streams: resp.streams,
                    error: false,
                    loading: false
                })
            },
            error: function () {
                innerThis.setState({
                    streams: {},
                    error: true,
                    loading: false
                });
            }
        });
    },
    refresh: function () {
        // Set our state to loading
        this.setState({
            streams: {},
            error: false,
            loading: true
        });

        // Get the stream list
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
        var streamRows = this.state.streams.map(function(stream) {
            return <TwitchStreamRow key={stream._id} streamInfo={stream}/>
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
    }
});

module.exports = TopTwitchStreams;