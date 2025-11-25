import {

    bot,
    backmenu
} from "../../bot.js";
import {
    chanelochirish,
    chanelqoshish,
    chanelsonichange,
    CHANNELS,
    natija
} from "../jsonreaders/chanel.js";
import {
    delmess,
    delmessages
} from "../funksiyalar/delmess.js";
import {
    Markup
} from "telegraf";
import { obunami } from "../funksiyalar/obunatek.js";

export default function () {
    
    bot.action('setting_sub', async (ctx) => {
        if(!ctx.session) ctx.session={}
        
        let kanal = ''
        for (let ch of CHANNELS) {
            if (ch.username == "boshqa") {
                kanal = kanal + `\n ${ch.name}: ${ch.link}, kerak: ${ch.soni} obunachi || Boshqa tarmoq`
            } else {

                kanal = kanal + ` ${ch.name}: ${ch.link}, kerak: ${ch.soni} obunachi || Telegram \n`
            }
        }

        const obj = {
            chanel_plus: "➕ Kanal qo'shish",
            chanel_minus: "➖ Kanal olib tashlansh",
            chanel_soni: "🔢 Kanal obuna sonini o'zgartirish",
            check_sub: "🔙 Bosh menuga qaytish"
        }
        const button = []
        for (let o in obj) {
            button.push([Markup.button.callback(obj[o], o)])
        }
        const msg = await ctx.reply(`Kanallar:\n \n ${kanal} \n Majburiy kanal sozlamalari: `, Markup
            .inlineKeyboard(button))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    });

    //Majburi a'zo kanalini qo'shish
    bot.action('chanel_plus', async (ctx) => {
        
        const msg = await ctx.reply("Kanal turini tanlang:", Markup.inlineKeyboard([
            [Markup.button.callback("Telegram kanal yoki guruh", 'chanel_type_telegram')],
            [Markup.button.callback("Boshqa turdagi tarmoq", 'chanel_type_boshqa')], backmenu
        ]))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    })
    //Majburiy a'zo kanali o'zgartirish
    bot.action('chanel_minus', async (ctx) => {
        
        
        let kanal = ''
        const kanal2 = []
        for (let i = 0; CHANNELS.length > i; i++) {
            let ch = CHANNELS[i]
            if (ch.username == "boshqa") {
                kanal = kanal + `\n ${ch.name}: ${ch.link}, soni: ${ch.soni} || Boshqa tarmoq`
            } else {

                kanal = kanal + ` ${ch.name}: ${ch.link}, soni: ${ch.soni} || Telegram \n`
            }

            kanal2.push([Markup.button.callback(ch.link, `chanel_change_${i}`)])
        }
        kanal2.push(backmenu)
        const msg = await ctx.reply(
            `Kanallar:\n \n ${kanal} \n O'chirilishi kerak bo'lgan kanalni tanlang: `,
            Markup.inlineKeyboard(kanal2))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    })
    bot.action('chanel_soni', async (ctx)=>{
       
        let kanal = ''
        const kanal2 = []
        for (let i = 0; CHANNELS.length > i; i++) {
            let ch = CHANNELS[i]
            if (ch.username == "boshqa") {
                kanal = kanal + `\n ${ch.link}: ${ch.soni} || Boshqa tarmoq`
            } else {

                kanal = kanal + ` ${ch.link}: ${ch.soni} || Telegram \n`
            }

            kanal2.push([Markup.button.callback(ch.link, `chanel_chsoni_${i}`)])
        }
        kanal2.push(backmenu)
        const msg = await ctx.reply(
            `Kanallar:\n \n ${kanal} \n Sonini o'zgartirish kerak bo'lgan kanalni tanlang: `,
            Markup.inlineKeyboard(kanal2))
        delmess(ctx)
        delmessages.set(ctx.chat.id, msg)
    })






    // chanel_change
    bot.on('text', async (ctx, next) => {
        if(!ctx.session) ctx.session={}
        let msg2
        if(ctx.session.step=="kanalid"){
            if(!isNaN(parseInt(ctx.message.text))){
                chanelqoshish(ctx.session.nomi,ctx.session.kanallinki,ctx.session.turi,2000,parseInt(ctx.message.text))
                let msg
                if (natija === 1) {
                    msg = await ctx.reply("Kanal defoult(2000) son bilan qo'shildi. O'zgartirish uchun kanal sonini kiriting,yoki Bosh menuga qayting", Markup.inlineKeyboard([backmenu]))
                    ctx.session.step="chanelsoni"
                } else {
                    msg = await ctx.reply("❌ Kanal linkida muammo bor!!!", Markup.inlineKeyboard([
                        backmenu
                    ]))
                }
                delmess(ctx)
                delmessages.set(ctx.chat.id, msg)
            }else{
                const msg=await ctx.reply("Id son bo'lishi kerak!!!", Markup.inlineKeyboard(backmenu))
                delmess(ctx)
                delmessages.set(ctx.chat.id, msg)
            }
        }else if (ctx.session.step == "kanallinki") {
            if (ctx.session.turi=="boshqa") {
                
                chanelqoshish(ctx.session.nomi, ctx.message.text, ctx.session.turi, 2000)
                let msg
                if (natija === 1) {
                    msg = await ctx.reply("Kanal default(2000) son bilan qo'shildi. O'zgartirish uchun Son o'zgartirishtugmasidan foydalaning", Markup.inlineKeyboard([backmenu]))
                } else {
                    msg = await ctx.reply("❌ Kanal linkida muammo bor!!!", Markup.inlineKeyboard([
                        backmenu
                    ]))
                }
                delmess(ctx)
                delmessages.set(ctx.chat.id, msg)
            }else if(ctx.session.turi=="telegram"){
                ctx.session.kanallinki=ctx.message.text
                const msg=await ctx.reply("Telegram Kanal/Guruh idsini kiriting:",Markup.inlineKeyboard(backmenu))
                delmess(ctx)
                delmessages.set(ctx.chat.id, msg)
                ctx.session.step="kanalid"
            }
            
            
        } else if (ctx.session.step == "kanalnomi") {
            ctx.session.nomi = ctx.message.text
            msg2 = await ctx.reply("Kanal linkini kiriting:", Markup.inlineKeyboard([backmenu]))
            ctx.session.step = "kanallinki"
            delmess(ctx)
            delmessages.set(ctx.chat.id, msg2)
            

        } else if (ctx.session.step == "chanelsoni") {
            delmess(ctx)
            const son=parseInt(ctx.message.text)
            const indexlink=parseInt(ctx.session.soni)
            console.log(indexlink);
            console.log(CHANNELS[indexlink].link);
            
            chanelsonichange(ctx,CHANNELS[indexlink].link,son)
            
            if(ctx.session.natija=="fail"){
                const msg= await ctx.reply("❌Sonda muammo bor", Markup.inlineKeyboard([backmenu]))
                delmessages.set(ctx.chat.id, msg)
            }else{
                const msg = await ctx.reply("✅Soni o'zgartirildi", Markup.inlineKeyboard([backmenu]))
                delmessages.set(ctx.chat.id, msg)
            }

        }

        return next()
    })
    bot.on('callback_query', async (ctx, next) => {
        const data = ctx.callbackQuery.data
        if (data.startsWith("chanel_type_")) {
            delmess(ctx)
            ctx.session.turi = data.split("chanel_type_")[1]
            const msg = await ctx.reply("Kanal nomini kiriting:", Markup.inlineKeyboard([backmenu]))
            delmessages.set(ctx.chat.id, msg)
            ctx.session.step = "kanalnomi"
            console.log(ctx.session.step);

        }
        if (data.startsWith("chanel_change_")) {
            delmess(ctx)
            const indexlink = parseInt(data.split("chanel_change_")[1])
            chanelochirish(CHANNELS[indexlink].link)
            const msg = await ctx.reply("✅Bot o'chirildi", Markup.inlineKeyboard([backmenu]))
            delmessages.set(ctx.chat.id, msg)
        }
        if (data.startsWith("chanel_chsoni_")) {
            delmess(ctx)
            ctx.session.soni= parseInt(data.split("chanel_chsoni_")[1])
            ctx.session.step="chanelsoni"
            const msg = await ctx.reply("Yangi sonni kiriting (cheksiz uchun manfiy son):", Markup.inlineKeyboard([backmenu]))
            delmessages.set(ctx.chat.id, msg)

            
        }
        return next()
    })
}