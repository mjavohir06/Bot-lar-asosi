import {
    chanelsaqla,
    CHANNELS
} from "../jsonreaders/chanel.js";
import {
    delmessages,
    delmess
} from "./delmess.js";
import {
    bot,
    backmenu,userId
} from "../../bot.js";
import {
    Telegraf,
    Markup
} from 'telegraf'
import {
    memberQoshish,
    MEMBERS
} from "../jsonreaders/member.js";
import fs from "fs"
import { qaytaol, yukla } from "../admin/messagetomembers.js";



async function obunami(ctx) {
    if (!ctx.session) ctx.session = {}
    let unsubscribed = []

    for (let ch of CHANNELS) {
        if (ch.username == "telegram") {

            try {
                const member = await ctx.telegram.getChatMember(ch.id, ctx.from.id);


                if (!['member', 'administrator', 'creator'].includes(member.status)) {
                    unsubscribed.push(ch);
                }
            } catch {
                unsubscribed.push(ch);
            }

        }
    }
    if (unsubscribed.length !== 0) {
        if (MEMBERS[ctx.from.id].turi !== "member") {} else {
            ctx.session.obunami = false
            obunatek(ctx)
            ctx.session.step = undefined
            ctx.session.nomi = undefined

        }
    } else {


        ctx.session.obunami = true
    }
}


async function obunatek(ctx) {
    if (!ctx.session) ctx.session = {}
    yukla()
    delmess(ctx)
    let unsubscribed = []
    ctx.session.step = undefined
    ctx.session.nomi = undefined
    ctx.session.turi = undefined
    let ObunaSet
    if (MEMBERS[ctx.from.id]) {
        ObunaSet = new Set(MEMBERS[ctx.from.id].obunalar)
    }
    for (let ch of CHANNELS) {
        if (ch.username == "telegram") {
            try {
                const member = await ctx.telegram.getChatMember(ch.id, ctx.from.id);
                if (!['member', 'administrator', 'creator'].includes(member.status) && ch.soni !== 0) {
                    unsubscribed.push(ch);
                    if (ObunaSet) {
                        if (ObunaSet.has(ch.link) && ch.soni > 0) {
                            ch.soni += 1
                            ObunaSet.delete(ch.link)
                            MEMBERS[ctx.from.id].obunalar = [...ObunaSet]
                        }
                    }
                } else {
                    if (ObunaSet) {
                        if (!ObunaSet.has(ch.link) && ch.soni > 0) {
                            ch.soni -= 1
                            ObunaSet.add(ch.link)
                            MEMBERS[ctx.from.id].obunalar = [...ObunaSet]
                        }
                    }
                }
            } catch {
                unsubscribed.push(ch);
            }

        }
    }
    if (unsubscribed.length > 0) {
        for (let ch of CHANNELS) {
            if (ch.username && ch.username == "boshqa") {
                unsubscribed.push(ch)
            }
        }

    } else {
        for (let ch of CHANNELS) {
            if (ch.username == "boshqa") {
                if (ObunaSet) {
                    if (!ObunaSet.has(ch.link)) {
                        ch.soni -= 1
                        ObunaSet.add(ch.link)
                        MEMBERS[ctx.from.id].obunalar = [...ObunaSet]
                    }
                }
            }
        }
    }
    if (MEMBERS[ctx.from.id].turi !== "member") {


        unsubscribed = []
    }

    if (unsubscribed.length === 0) {

        ctx.session.obunami = true
        chanelsaqla()
        //Asosiy menu tugmasini nomilari va buyruqlari

        const objega = [
            {
                setting_sub: "📢Majburiy kanal sozlamalari",
                member_change: "A'zolar Statusini o'zgartirish"
            },
            {
                send_messagetm: "💬Barcha bot a'zolariga habar yuborish",
                foydalanuvchi_soni: "👥Bot foydalanuvchilari soni"
            },
            {
                xabarochir:"A'zolarga yuborilgan habarlarni o'chirish"
            }
        ]
        const objadmin = [
            {
                send_messagetm: "💬Barcha bot a'zolariga habar yuborish",
                foydalanuvchi_soni: "👥Bot foydalanuvchilari soni"
            },
            {
                xabarochir:"A'zolarga yuborilgan habarlarni o'chirish"
            }
        ]
        const menu = []

        if (MEMBERS[ctx.chat.id].turi == "ega") {
            let i = 0
            for (let e of objega) {
                menu[i] = []
                for (let o in e) {
                    menu[i].push(Markup.button.callback(e[o], o))

                }
                i++
            }


        } else if (MEMBERS[ctx.chat.id].turi == "admin") {
            let i = 0
            for (let e of objadmin) {
                menu[i] = []
                for (let o in e) {
                    menu[i].push(Markup.button.callback(e[o], o))

                }
                i++
            }


        }

        const msg = await ctx.reply("Botga xush  kelibsiz.\n Botdan foydalanish uchun quyidagi tugmalarni tanlang",
            Markup.inlineKeyboard(menu));
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)

        // fs.writeFileSync('file.txt',"salomlar423 \n \thello",'utf-8')
        // await ctx.replyWithDocument({source:"file.txt",filename:"file.txt"})


    } else {
        const buttons = unsubscribed.map((ch) => [Markup.button.url(ch.name, ch.link)]);

        buttons.push([Markup.button.callback('✅ Yana tekshirish', 'check_sub')]);


        const msg = await ctx.reply(
            '⚠️ Hali ham quyidagi kanallarga obuna bo‘lishingiz kerak:',
            Markup.inlineKeyboard(buttons)
        );
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    }
}


export default obunatek
export {
    obunami
}