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
    openStream: function () {
        var id = this.createDOMElement();

        ReactDOM.render(
            <WidgetContainer initialX={100} initialY={200} title={this.props.streamInfo.channel.status}>
                <div dangerouslySetInnerHTML={this.iframe(this.props.streamInfo.channel.name)}></div>
            </WidgetContainer>,
            document.getElementById(id));
    },
    render: function () {
        return (
            <Row className="twitchStreamRow">
                <Col md={4}>
                    <img src={this.props.streamInfo.preview.small}/>
                </Col>
                <Col md={4}>
                    {this.props.streamInfo.channel.status}
                </Col>
                <Col md={4}>
                    <Button onClick={this.openStream}>Open Stream</Button>
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
        console.log("Refreshing");
        this.setState({
            streams: {},
            error: false,
            loading: true
        });
        this.setState(this.getStreams);
    },
    render: function () {
        if (this.state.loading) {
            return (
                <div>Loading...</div>
            )
        }
        else if (this.state.error) {
            return (
                <div>Whoops... encountered an error while trying to fetch stream list.</div>
            )
        }
        var streamRows = this.state.streams.map(function(stream) {
            return <TwitchStreamRow key={stream._id} streamInfo={stream}/>
        });

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