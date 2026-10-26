import {
    Telegraf,
    Markup,
    session
} from 'telegraf'
// const path=require('path')

const ega = 6622110096 //Bot egasi telegram idsi 

import {
    CHANNELS,
    natija,
    chanelochirish,
    chanelqoshish
} from './elements/jsonreaders/chanel.js'
import {
    MEMBERS,
    memberQoshish
} from './elements/jsonreaders/member.js'
import obunatek, {
    obunami
} from './elements/funksiyalar/obunatek.js'
import {
    delmessages,
    delmess
} from './elements/funksiyalar/delmess.js'

import Chanel_change from './elements/ega/Chanel_change.js'
import messagetomembers from './elements/admin/messagetomembers.js'
import Memberchange from './elements/ega/Memberchange.js'
import Foydalanuchilar_soni from './elements/admin/Foydalanuchilar_soni.js'
import Habarochir from './elements/admin/Habarochir.js'
// chanels.jsondan ma'lumot olish


const bot_token = process.env.BOT_TOKEN

const bot = new Telegraf(bot_token)

bot.use(session())



// 🔗 Majburiy obuna kanallari (public yoki private)
const newMembersMap = new Map(Object.entries(MEMBERS))

let userId, bott, backmenu = [Markup.button.callback("🔙 Bosh menuga qaytish", 'check_sub')]
bot.telegram.deleteWebhook({ drop_pending_updates: true }).then(() => {
  console.log("Oldingi pending update’lar tozalandi!");
});

// ✅ /start komandasi
bot.start(async (ctx) => {
    
    bott = ctx
    userId = ctx.from.id;

    if (newMembersMap.has(String(userId))) {
        MEMBERS[userId].name = ctx.from.first_name

    } else {
        MEMBERS[userId] = {
            name: ctx.from.first_name,
            turi: "member",
            obunalar:[]
        }
        
    }
    memberQoshish()
    
    obunatek(ctx)

});

// ✅ "Tekshirish" tugmasi
bot.action('check_sub', async (ctx) => {
    obunatek(ctx)
    if(!ctx.session) ctx.session={}

});


//-----------------------------------------Majburiy-kanal-a'zoligi---------------------------------------------//

//Majburiy kanal sozlamari faqatgina bot egasi uchun ishlaydi 
Chanel_change()


// Foydaluvchi statusini o'zgartirish :  member, admin, ega
Memberchange()

//-------------A'zolarga-habar-yuborish-----------//
messagetomembers()
Habarochir()

Foydalanuchilar_soni()




















export {
    bott,
    userId,
    bot,
    backmenu
}

bot.launch();
console.log('✅ Bot ishga tushdi...');