module.exports = {
    longDate: function (date) {
        var m = '0' + date.getMonth();
        var d = '0' + date.getDate();
        return date.getFullYear() + '.' + m.substring(m.length - 2) + '.' + d.substring(d.length - 2);
    }
}