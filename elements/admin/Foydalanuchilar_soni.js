import {
    Markup
} from "telegraf";
import {
    backmenu,
    bot
} from "../../bot.js";
import {
    MEMBERS
} from "../jsonreaders/member.js";
import { delmess } from "../funksiyalar/delmess.js";

export default function () {
    let i=0
    bot.action('foydalanuvchi_soni', async (ctx) => {
        delmess(ctx)
        for(let ch in MEMBERS){
            i++
        }
        const msg = ctx.reply(`Botning Foydalanuvchilari soni: ${i}`, Markup
            .inlineKeyboard(backmenu))
    })
}