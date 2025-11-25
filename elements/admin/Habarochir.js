import { Markup } from "telegraf";
import { backmenu, bot } from "../../bot.js";
import { qaytaol, YUBORILGAN, yukla } from "./messagetomembers.js";
import { delmess, delmessages } from "../funksiyalar/delmess.js";


export default function (){
    bot.action('xabarochir', async (ctx)=>{
        if(!ctx.session) ctx.session={}
        delmess(ctx)
        let button=""
        qaytaol()
        
        
        for(let y in YUBORILGAN){
            console.log(y);
            if(y!=="id"){
                button+=`id: ${y} \n`

            }
        }
        const msg =await ctx.reply(`Kerakli habarni idsini yuboring:\n ${button}`,Markup.inlineKeyboard(backmenu))
        delmessages.set(ctx.chat.id, msg)
        ctx.session.step="habarochir"
    })
    bot.on('text',async (ctx,next)=>{
        if(ctx.session.step=="habarochir"){
            delmess(ctx)
            const id =ctx.message.text
            const newdata={}
            
            if(!isNaN(parseInt(id)) && YUBORILGAN[id]!==undefined){
                const x=YUBORILGAN[id]
                if(typeof x === 'object' && x !== null && !Array.isArray(x)){
                    try{
                        for(let o in x){
                            ctx.telegram.deleteMessage(o,x[o])
                        }
                        for(let y in YUBORILGAN){
                            if(y!==id){
                                newdata[y]=YUBORILGAN[y]
                            }
                        }
                        yukla(newdata)
                        qaytaol()
                        const msg=await ctx.reply("O'chirildi",Markup.inlineKeyboard(backmenu))
                        delmessages.set(ctx.chat.id, msg)

                    }catch(er){

                    }

                }
            }
        }



        return next()
    })
}