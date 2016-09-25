/**
 * Created by Robert on 2016-09-24.
 */

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

var Guid = {
    createGuid: function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4()}
};

module.exports = Guid;