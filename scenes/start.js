const {
    Scenes
} = require('telegraf')
const User = require('../User')

const start = new Scenes.BaseScene('start')

start.enter(async ctx => {
    try {
        const name = ctx.update.message.from.first_name
        const id = Number(ctx.update.message.from.id)

        await User.isAdminCreate()
        const user = await User.getUserById(id)
        await ctx.reply(`Привет, ${name}!`)
        console.log('Пользователь вошел в чат: ' + id, name)
        if (user) {
            ctx.scene.enter('process')
        } else ctx.reply(`${name}, у вас нет доступа!`)
    } catch (error) {
        console.log(error)
    }
})
start.on('message', async ctx => {
    const text = ctx.update.message.text
    const name = ctx.update.message.from.first_name
    const id = Number(ctx.update.message.from.id)
    const user = await User.getUserById(id)

    if (user) {
        ctx.scene.enter('process')
    } else {
        console.log('command text ---->', text);
        ctx.reply(`Все говорят "${text}", а ты возьми и купи слона!`)
        ctx.reply(`попытка доступа к файлам пользователем: 
                    ID: ${id}
                    Name: ${name}`, {
            chat_id: process.env.ADMIN
        })

    }
})


module.exports = start