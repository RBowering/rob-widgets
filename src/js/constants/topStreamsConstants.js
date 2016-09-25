/**
 * Created by Robert on 2016-09-24.
 */

var TopStreamsConstants = {
    // Events
    STREAM_OPEN: "topStreams-sttream-open",
    STREAM_CLOSE: "topStreams-stream-close",
    REFRESH_ROWS: "topStreams-updateRows",
    FETCH_ROWS: "topStreams-fetchRows",

    // Misc.
    IFRAME_TEMPLATE : '<iframe src="http://player.twitch.tv/?channel={CHANNEL}" height="720" width="1280" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>'
};

module.exports = TopStreamsConstants;