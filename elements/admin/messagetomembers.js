import { Markup } from "telegraf"
import {

    bot,
    backmenu
} from "../../bot.js"
import {
    delmess,
    delmessages
} from "../funksiyalar/delmess.js"
import {
    MEMBERS
} from "../jsonreaders/member.js"
import { obunami } from "../funksiyalar/obunatek.js"
import fs from "fs"

let YUBORILGAN
function qaytaol() {
    if (fs.existsSync('yuborilgan.json')) {
        YUBORILGAN = JSON.parse(fs.readFileSync('yuborilgan.json', 'utf-8'))
    } else {
        YUBORILGAN = { "id": 0 }
    }
}
qaytaol()
function yukla(object) {
    if (object) {
        fs.writeFileSync('yuborilgan.json', JSON.stringify(object, null, 2), 'utf-8')
    } else {

        fs.writeFileSync('yuborilgan.json', JSON.stringify(YUBORILGAN, null, 2), 'utf-8')
    }

}
//-------------A'zolarga-habar-yuborish-----------//
export default function () {


    bot.action('send_messagetm', async (ctx) => {
        qaytaol()
        if (!ctx.session) ctx.session = {}
        ctx.session.step = "messagetm"
        const msg = await ctx.reply(
            "Barcha a'zoga habar yuborish uchun habar kiriting (Eslatma agar url link kiritish kerak bo'lsa oxirida ||  yordamida chegarlang va [['nomi','url:htttps bilan'],['nomi','url']] kabi yozing):",
            Markup.inlineKeyboard([backmenu]))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    })
    bot.action('delate_this', async (ctx) => {
        delmess(ctx)
        try {
            if (ctx.session.delmessid) {
                const x = ctx.session.delmessid
                if (typeof x === 'object' && x !== null && !Array.isArray(x)) {
                    for (let o in x) {
                        try{
                            ctx.telegram.deleteMessage(o, x[o])

                        }catch(err){
                            
                        }
                    }

                    const msg = await ctx.reply("O'chirildi", Markup.inlineKeyboard(backmenu))


                    qaytaol()
                    delmessages.set(ctx.chat.id, msg)
                    console.log(delmessages);

                }
                ctx.session.delmessid = {}
            }
        } catch {

        }
    })

    bot.on('text', async (ctx, next) => {



        if (ctx.message && ctx.session.step == "messagetm") {
            if (ctx.message.text) {
                let text, url = []
                delmess(ctx)
                let urlbtn = []

                if (ctx.message.text.includes("||")) {
                    const mes = ctx.message.text.split("||")
                    text = mes[0]
                    let tx = mes[1].trim()
                    if (tx.endsWith("]]") && tx.startsWith("[[")) {
                        url = JSON.parse(tx)

                        for (let u of url) {

                            if (u.length == 2 && u[1].startsWith("https://")) {
                                urlbtn.push([Markup.button.url(u[0], u[1])])
                            }
                        }

                    } else {
                        const msg = ctx.reply("❌ Yozishda xatolik bor", Markup.inlineKeyboard(backmenu))
                        delmessages.set(ctx.chat.id, msg)

                    }
                } else {
                    text = ctx.message.text
                }




                try {
                    let mesage,i=0
                    ctx.session.delmessid = {}
                    const messageid = YUBORILGAN["id"]
                    YUBORILGAN[messageid] = {}
                    for (let member in MEMBERS) {
                        try{
                            if (urlbtn.length > 0) {
                                mesage = await bot.telegram.sendMessage(member, text, Markup.inlineKeyboard(urlbtn))
    
                            } else {
                                mesage = await bot.telegram.sendMessage(member, text)
                            }
                            console.log(YUBORILGAN);
                            YUBORILGAN[messageid][member] = mesage.message_id
                            ctx.session.delmessid[member] = mesage.message_id
                            if (MEMBERS[member].turi == "ega") {
                                bot.telegram.sendMessage(member, `A'zolarga habar yuborildi! Yuboruvchi: ${MEMBERS[member].name} , id: ${member}`)
                            }

                        }catch(er){
                            i++
                        }
                    }
                    YUBORILGAN['id'] += 1

                    const msg = ctx.reply(`Xabar yuborildi ✅.\n ${i} ta foydalanuvchiga yuborilmadi. Habar o'chirilsinmi Habar idisi:\n -----   ${mesage.message_id}  -----`, Markup.inlineKeyboard([[Markup.button.callback("Ha,O'chirilsin", `delate_this`)], backmenu]))

                    delmessages.set(ctx.chat.id, msg)

                } catch {

                    const msg = ctx.reply("Habarda xato bor ❌", Markup.inlineKeyboard(backmenu))
                    delmessages.set(ctx.chat.id, msg)
                }

            }
        }
        return next()
    })




    bot.on('photo', async (ctx, next) => {
        if (ctx.message && ctx.session.step == "messagetm") {
            let photoid
            const messages = {}
            if (ctx.message.photo) {
                const photol = ctx.message.photo


                photoid = photol[photol.length - 1].file_id

                if (ctx.message.caption) {
                    let text, url = []


                    if (ctx.message.caption.includes("||")) {
                        const mes = ctx.message.caption.split("||")
                        text = mes[0]
                        let tx = mes[1].trim()
                        if (tx.endsWith("]]") && tx.startsWith("[[")) {
                            url = JSON.parse(tx)

                            let urlbtn = []
                            for (let u of url) {

                                if (u.length == 2 && u[1].startsWith("https://")) {
                                    urlbtn.push([{
                                        text: u[0],
                                        url: u[1]
                                    }])
                                }
                            }

                            messages.caption = text
                            messages.reply_markup = {
                                inline_keyboard: urlbtn
                            }



                        } else {
                            const msg = await ctx.reply("❌ Yozishda xatolik bor", Markup.inlineKeyboard(
                                backmenu))
                            delmessages.set(ctx.chat.id, msg)

                        }
                    } else {
                        messages.caption = ctx.message.caption
                    }
                }



            }

            try {
                let mesage,i=0
                const messageid = YUBORILGAN["id"]
                YUBORILGAN[messageid] = {}
                ctx.session.delmessid = {}
                for (let member in MEMBERS) {
                    try {
                        mesage = await bot.telegram.sendPhoto(member, photoid, messages)
                        YUBORILGAN[messageid][member] = mesage.message_id
                        if (MEMBERS[member].turi == "ega") {
                            bot.telegram.sendMessage(member, `A'zolarga habar yuborildi! Yuboruvchi: ${MEMBERS[member].name}  tg://user?id=${member} , id: ${member}`)
                        }
                        ctx.session.delmessid[member] = mesage.message_id
                    } catch {
                        i++
                    }

                }
                const msg = ctx.reply(`Xabar yuborildi ✅.\n ${i} ta foydalanuvchiga yuborilmadi.  Habar o'chirilsinmi Habar idisi:\n -----   ${mesage.message_id}  -----`, Markup.inlineKeyboard([[Markup.button.callback("Ha,O'chirilsin", `delate_this`)], backmenu]))
                YUBORILGAN['id'] += 1

                delmessages.set(ctx.chat.id, msg)
            } catch (error) {
                const msg = await ctx.reply("Xabar yuborilmadi ❌", Markup.inlineKeyboard(backmenu))
                delmessages.set(ctx.chat.id, msg)
            }


        }
        return next()
    })

}


export { YUBORILGAN, yukla, qaytaol }