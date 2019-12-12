const format = require("string-template")
const SocksProxyAgent = require('socks-proxy-agent');

const conf = require('./conf');
const db = require('./db')
// db.load();

var url = '';

var bc = new (require('./blockchain'))(url, '', '');
var kg = new (require('./kindergarten'))(bc);

const Telegraf = require('telegraf')
// const HttpsProxyAgent = require('https-proxy-agent')


// SOCKS proxy to connect to
console.log('using proxy server %j', proxy);
var proxy = process.env.socks_proxy || 'socks://127.0.0.1:9050';
var agent = new SocksProxyAgent(proxy);
const bot = new Telegraf(conf.token, {
    telegram: {
        agent: agent //new HttpsProxyAgent('http://127.0.0.1:9050')
    }
})

const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')

const langs = require('./langs')

const stores = [
    {
        code: 1,
        name: {
            en: 'Babystore #1',
            ru: 'Детский сад №1',
            uz: 'Дешкамсанда ульманда 1'
        }
    },

    {
        code: 2,
        name: {
            en: 'Babystore #2',
            ru: 'Детский сад №2',
            uz: 'Дешкамсанда ульманда 2'
        }
    },

    {
        code: 2,
        name: {
            en: 'Babystore #2',
            ru: 'Детский сад №2',
            uz: 'Дешкамсанда ульманда 2'
        }
    }
]

var users = {};

function get_user(ctx) {
    if (!users[ctx.chat.id]) {
        users[ctx.chat.id] = {
            id: ctx.chat.id,
            lang: langs['en']
        };


        db.load_user(ctx.chat.id);
    }
    // db.append('1', [1,2,3,4,5,"33","35","36","37"]);

    // bot.telegram.sendMessage(ctx.chat.id, 'aaa', {
    //     text: `<b>Chat ID:</b> <code>${ctx.chat.id}</code>`,
    //     parse_mode: "HTML"
    // });
    // bot.telegram.sendMessage(ctx.chat.id, Markup.keyboard(["Requests"]).extra());
    /*
        const testMenu = Telegraf.Extra
        .markdown()
        .markup((m) => m.inlineKeyboard([
          m.callbackButton('Test button', 'test')
        ]))
      
      const aboutMenu = Telegraf.Extra
        .markdown()
        .markup((m) => m.keyboard([
          m.callbackButton('⬅️ Back')
        ]).resize())
      
      
        ctx.reply('Чтобы ', testMenu).then(() => {
          ctx.reply('_', aboutMenu)
        })
    */


    return users[ctx.chat.id];
}

function send_html(user, html) {
    bot.telegram.sendMessage(user.id, 'html', {
        text: html, //`<b>Chat ID:</b> <code>${ctx.chat.id}</code>`,
        parse_mode: "HTML"
    });
}



function select_language_dialog(ctx) {
    var gui = Object.keys(langs).map(k => Markup.callbackButton(langs[k].name, k));
    // gui.push(Markup.callbackButton(l.name, l.code))

    ctx.reply('Выберите язык',
        Markup.inlineKeyboard(gui).extra()
    )
}

function select_language_done(ctx) {
    var user = get_user(ctx);
    var lc = ctx.update.callback_query.data; // Код языка

    var lang = langs[lc];
    if (lang == null) {
        ctx.reply('ERROR. Language not found.')
        return;
    }

    user.lang = lang;
    intro_dialog(ctx);

    const aboutMenu = Telegraf.Extra
        .markdown()
        .markup((m) => m.keyboard([
            m.callbackButton(user.lang.btn_main_menu)
        ]).resize())

    bot.telegram.sendMessage(ctx.chat.id, user.lang.msg_back, aboutMenu);
}


function intro_dialog(ctx) {
    var user = get_user(ctx);
    if (!user.lang) {
        select_language_dialog(ctx)
        return;
    }

    user.step = '';
    var lang = user.lang;

    ctx.reply(lang.msg_intro,
        Markup.inlineKeyboard([
            Markup.callbackButton(lang.msg_request_new, 'request_new'),
            Markup.callbackButton(lang.msg_request_list, 'request_list'),
        ]).extra())
}

function intro_done(ctx) {
    var user = get_user(ctx);
    if (!user.lang) {
        select_language_dialog(ctx)
        return;
    }

    user.step = '';
    select_store_dialog(ctx)
}

bot.action('request_list', request_list_dialog)

function request_list_dialog(ctx) {
    var user = get_user(ctx);
    // console.log(user.id);
    if (!db.data[user.id]) {
        ctx.reply(user.lang.msg_norequests)
    }
    else {
        check_request_status(user);
    }
}

async function get_requests_status(user) {
    return new Promise((resolve, reject) => {
        if (!db.data[user.id]) {
            resolve([])
        }
        else {
            var reqs = [];
            var cnt = db.data[user.id].length;
            var i = 0;
            var then = r => {
                reqs.push({ id: db.data[user.id][i], status: r });
                i++;
                if (i < cnt) kg.status(db.data[user.id][i]).then(r => then(r));
                else resolve(reqs);
            }
            kg.status(db.data[user.id][i]).then(r => then(r));
        }
    })
}

async function check_request_status(user) {
    // console.log('check_request_status', user)
    get_requests_status(user).then(res => {
        console.log(user, res);
        var tpl = user.lang.tpl_status
        send_html(user, user.lang.msg_your_requests + "\r\n" + res.map(rq => rq.id + ': ' + kg.pretty_status(tpl, rq.status)).join('\r\n'))
    });
}

function check_allrequest_status() {
    // console.log('check_allrequest_status')

    db.check_news().then(has_news => {
        // console.log('check_allrequest_status has_nem', has_news)
        if (has_news) {
            var keys = Object.keys(users)
            var i = 0;
            var cnt = keys.length

            var then = r => {
                console.log(i, cnt, i < cnt, keys[i]);
                if (i < cnt)
                    check_request_status(users[keys[i++]]).then(r => then(r));
                else
                    setTimeout(check_allrequest_status, 60 * 1000);
            }
            then();
        }
        else {
            setTimeout(check_allrequest_status, 60 * 1000);
        }
    })
}
check_allrequest_status()



function select_store_dialog(ctx) {
    var user = get_user(ctx);
    if (!user.lang) {
        select_language_dialog(ctx)
        return;
    }

    user.step = '';
    var lang = user.lang;

    ctx.reply(lang.msg_select_store,
        Markup.inlineKeyboard(
            stores.map(s => Markup.callbackButton(s.name[lang.code], 'select_store_' + s.code))
        ).extra())
}

function select_store_done(ctx) {
    var user = get_user(ctx);
    if (!user.lang) {
        select_language_dialog(ctx)
        return;
    }
    var sc = ctx.update.callback_query.data.replace('select_store_', ''); // Код садика

    user.step = '';
    var store = stores.filter(s => s.code == sc)[0];
    if (store == null) {
        ctx.reply('ERROR: Garten not found.')
        return;
    }

    user.store = store;
    enter_fio_dialog(ctx)
}

function enter_fio_dialog(ctx) {
    var user = get_user(ctx);
    user.step = 'enter_fio';
    var lang = user.lang;
    ctx.reply(lang.msg_enter_fio)
}

function enter_fio_done(ctx) {
    var user = get_user(ctx);
    if (!user.lang) {
        select_language_dialog(ctx)
        return;
    }

    user.step = '';
    user.fio = ctx.update.message.text;
    check_fields_dialog(ctx)
}

function check_fields_dialog(ctx) {
    var user = get_user(ctx);
    user.step = 'check_fields';
    var lang = user.lang;

    ctx.reply(lang.msg_check_data + '\r\n' + user.store.name[user.lang.code] + '(' + user.store.code + ')' + '\r\n' + user.fio,
        Markup.inlineKeyboard([
            Markup.callbackButton(lang.msg_yes, 'check_fields_yes'),
            Markup.callbackButton(lang.msg_no, 'check_fields_no')
        ]).extra())
}


function check_fields_done(ctx) {
    var user = get_user(ctx);
    user.step = '';

    if (!user.store) return;
    console.log(user);

    // kg.count(bc).then(r => console.log('count is ',r));
    kg.create(kg.build_data(user.store.name[user.lang.code], user.fio))
        .then(r => {
            kg.count().then(r2 => {
                ctx.replyWithHTML(format(user.lang.msg_requets_accepted, { code: r.result, index: r2.result }))
                db.append(user.id, r2.result)
            }
            ).catch(ex => ctx.reply("ERROR. Somethig goes wrong2." + ex.message));
        })
        .catch(ex => ctx.reply("ERROR. Somethig goes wrong1." + ex.message));
}



function process_text(ctx) {
    var user = get_user(ctx)
    // if (user){
    //     user.store = stores[0];
    //     user.lang = langs[0];
    //     user.fio = 'asdasd';
    //     check_fields_done(ctx);
    // }
    // ctx.replyWithHTML ('<b>Somedata</b><a href="ya.ru">Lnk</a>')

    if (!user) {
        select_language_dialog(ctx);
        return;
    }

    else if (user.step == 'enter_fio') {
        enter_fio_done(ctx);
        return;
    }

    var backs = Object.keys(langs).map(k => langs[k].btn_main_menu)
    if (backs.indexOf(ctx.update.message.text) >= 0) {
        select_language_dialog(ctx);
        return;
    }
}



bot.start(select_language_dialog);
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.on('text', (ctx) => process_text(ctx))
// bot.on('text', (ctx) => console.log('text', ctx.message))
// bot.on('message', (ctx) => console.log('text', ctx.message))

bot.hears('hi', (ctx) => ctx.reply('Hey there'))


// bot.hears('a', select_language_dialog)
Object.keys(langs).map(k => bot.action(k, select_language_done))
// Object.keys(langs).map(k => bot.hears('⬅️ ' + langs[k].msg_back, select_language_dialog))

bot.action('request_new', intro_done)
stores.map(s => bot.action('select_store_' + s.code, select_store_done))

bot.action('check_fields_yes', check_fields_done)
bot.action('check_fields_no', intro_dialog)


bot.launch()