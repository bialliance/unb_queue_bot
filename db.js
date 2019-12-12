const fs = require('fs')
const axios = require('axios')

module.exports = {

    data: {},

    last_changed: 0,

    load: function () {
        this.data = JSON.parse(fs.readFileSync('./db.json').toString());
    },

    load_user: function (uid) {
        axios.get('' + uid).then(res => {
            this.data[uid] = JSON.parse(res.data) || [];
            console.log(JSON.parse(res.data))
        })
        // this.data =  JSON.parse(fs.readFileSync('./db.json').toString());
    },

    save: function () {
        fs.writeFileSync('./db.json', JSON.stringify(this.data));
    },

    append: function (user_id, req_id) {
        this.data[user_id].push(req_id)
        axios.post('' + user_id, this.data[user_id]).then(r => { console.log(r) });
    },

    check_news: async function () {
        return new Promise((resolve, reject) => {
            axios.get('')
                .then(r => {
                    // console.log(r.data, this.last_changed)
                    if (r.data > this.last_changed) {
                        this.last_changed = r.data;
                        resolve(true)
                    }
                    else
                        resolve(false)
                })
                .catch(ex => reject(ex));
        })
    }
}