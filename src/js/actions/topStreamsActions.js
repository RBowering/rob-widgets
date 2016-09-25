/**
 * Actions for the TopStreams widget
 *
 * Created by Robert on 2016-09-24.
 */

var AppDispatcher = require("../dispatcher/appDispatcher");
var TopStreamsConstants = require("../constants/topStreamsConstants");

var TopStreamsActions = {
    /**
     * Action for when a row opens its stream
     *
     * @param id The Twitch ID of the stream
     */
    openStream: function(id) {
        AppDispatcher.handleViewAction({
            actionType: TopStreamsConstants.STREAM_OPEN,
            id: id
        });
    },

    /**
     * Action for when a row closes its stream
     * @param id The Twitch ID of the stream
     */
    closeStream: function (id) {
        AppDispatcher.handleViewAction({
            actionType: TopStreamsConstants.STREAM_CLOSE,
            id: id
        });
    },

    /**
     * Action to refresh the list of streams
     */
    refreshStreams: function () {
        AppDispatcher.handleViewAction({
            actionType: TopStreamsConstants.REFRESH_ROWS
        })
    },

    /**
     * Action to change the current game the list of streams is looking for.
     * TODO: Fully implement switching game name
     */
    changeGame: function (game) {
        AppDispatcher.handleViewAction({
            actionType: TopStreamsConstants.REFRESH_ROWS,
            game: game
        })
    }
};

module.exports = TopStreamsActions;
