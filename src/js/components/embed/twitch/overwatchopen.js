var React = require("react");

const overwatchEmbed = '<iframe src="https://player.twitch.tv/?channel=overwatchopen" frameborder="0" scrolling="no" height="378" width="620"></iframe><a href="https://www.twitch.tv/overwatchopen?tt_medium=live_embed&tt_content=text_link" style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px;text-decoration:underline;">Watch live video from overwatchopen on www.twitch.tv</a>';

var OverwatchOpenStream = React.createClass({
    iframe: function () {
        return {
            __html: overwatchEmbed
        }
    },

    render: function () {
        return (
            <div>
                <div dangerouslySetInnerHTML={this.iframe()}>
                </div>
            </div>
        )
    }
});

module.exports=OverwatchOpenStream;