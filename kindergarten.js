var querystring = require('querystring');
const tools_dt = require('./tools_datetime')
const format = require("string-template")

module.exports = class Kindergarten {

    constructor(bc) {
        this.bc = bc;
    }

    async count() {
        return this.bc.call({
            controller: 'call',
            contract_id: 338,
            func: 'count',
            funcVal: ''
        })
    }

    // uint256 _date, string memory _oyName, uint256 _oyId, uint256 _userId, string memory _userName, string memory _status, uint256 _statusDate, string memory _comment
    // Сформировать пакет для отправки в create.
    build_data(kgName, childFio) {
        return [
            Math.round((new Date()).getTime() / 1000),
            kgName,
            1,
            1,
            childFio,
            "Новая",
            Math.round((new Date()).getTime() / 1000),
            "Примите в детский сад"
        ]
    }

    async create(data) {
        return this.bc.call({
            controller: 'send',
            contract_id: 338,
            func: 'newRecord',
            funcVal: JSON.stringify(data)
        })
    }

    async status(req_ind) {
        return new Promise((reslove, reject) => {
            this.bc.call({
                controller: 'call',
                contract_id: 338,
                func: 'History',
                funcVal: JSON.stringify([req_ind.toString()])
            }).then(r => reslove(r.result ? r.result : ""))
        })
    }

    /** Форматировать статус заявки */
    pretty_status(tpl, data) {

        if (data == null) return "Server error";

        var data2 = Object.assign({}, data);
        data2.date = tools_dt.longDate(new Date(parseInt(data.date) * 1000));        
        return format(tpl, data2)

    }
}