/**
 * Created by Robert on 2016-09-24.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var TopStreamsConstants = require("../constants/topStreamsConstants");
var $ = require('jquery');
var Guid = require('../helpers/guid');

var CHANGE_EVENT = 'change';

var _rows = {};
var _openStreams = {};
var _loading = true;
var _error = false;
var _game = "Overwatch";

function create(stream) {
    if (!_rows.hasOwnProperty(stream._id)) {
        return  {
            streamInfo: stream,
            disableOpenButton: _openStreams.hasOwnProperty(stream._id),
            widgetDomId: Guid.createGuid(),
            iframeSrc: TopStreamsConstants.IFRAME_TEMPLATE.replace("{CHANNEL}", stream.channel.name)
        }
    }
    else {
        return _rows[stream._id];
    }
}

function updateStreamList (streams) {
    var newRows = {};
    for (var key in streams) {
        newRows[streams[key]._id] = create(streams[key]);
    }
    _rows = newRows;
}

function destroy(id) {
    delete _rows[id];
}

var TopStreamsStore = assign({}, EventEmitter.prototype, {

    getState: function() {
        var streamsArray = [];
        for (var key in _rows)
        {
            streamsArray.push(_rows[key]);
        }

        return {
            rows : streamsArray,
            loading: _loading,
            error: _error
        };
    },

    getStream: function (id) {
        return _rows[id];
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getStreams: function () {
        var url = "https://api.twitch.tv/kraken/streams?game=" + _game + "&limit=10";
        $.ajax(url, {
            headers: {
                "Client-ID": "qh5u1ijoshfo2pghf01ianulezryatr"
            },
            success: function(resp) {
                updateStreamList(resp.streams);
                _error = false;
                _loading = false;
            },
            error: function () {
                _error = true;
                _loading = false;
            },
            complete: function () {
                TopStreamsStore.emitChange();
            }
        });
    },

    dispatcherIndex: AppDispatcher.register(function(payload) {
        var action = payload.action;

        switch(action.actionType) {
            case TopStreamsConstants.STREAM_OPEN:
                _rows[action.id].disableOpenButton = true;
                TopStreamsStore.emitChange();
                break;

            case TopStreamsConstants.STREAM_CLOSE:
                delete _openStreams[action.id];
                _rows[action.id].disableOpenButton = false;
                TopStreamsStore.emitChange();
                break;

            case TopStreamsConstants.REFRESH_ROWS:
                _loading = true;
                _error  = false;

                if (typeof action.game !== "undefined" && action.game !== "") {
                    _game = action.game;
                }

                TopStreamsStore.getStreams();
                TopStreamsStore.emitChange();
                break;
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })

});

module.exports = TopStreamsStore;