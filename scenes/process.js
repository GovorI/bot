const {
    Scenes
} = require('telegraf')
const path = require('path')
const User = require('../User')
const {
    createButtons,
    viewButtons,
    sendFile
} = require('../controllers/fileManager')
const {
    isAdmin
} = require('../User')

const process = new Scenes.BaseScene('process')

process.enter(async ctx => {
    try {
        const name = ctx.update.message.from.first_name
        const id = Number(ctx.update.message.from.id)
        const user = await User.getUserById(id)
        const btn = await createButtons(path.join(__dirname, '../', 'data'))
        viewButtons(ctx, btn.menuButtons, btn.filesButtons)
        User.saveUser(id, user.isAdmin, name, path.join(__dirname, '../', 'data'), btn.menuButtons, btn.filesButtons)
    } catch (error) {
        console.log(error)
    }


})
process.on('text', async ctx => {
    const text = ctx.update.message.text
    const name = ctx.update.message.from.first_name
    const id = Number(ctx.update.message.from.id)
    const user = await User.getUserById(id)

    switch (text) {
        case '/start':
           await ctx.scene.enter('start')
            break
        case '/admin':
            if (user.isAdmin) {
                ctx.scene.enter('admin')
            } else {
                ctx.reply('У вас нет прав администратора')
            await ctx.scene.enter('process') 
            }
            break
        default:
            await action(ctx, id, text, user, name)
    }
})

process.on('callback_query', async ctx => {
    const fileId = ctx.update.callback_query.data
    await sendFile(ctx, fileId)
})

async function action(ctx, id, text, user, name) {
    try {
        for (let i of user.menuButtons) {
            if (i[0].text === text) {
                let buttons = await createButtons(i[0].callback_data)
                await User.saveUser(id, user.isAdmin, name, i[0].callback_data, buttons.menuButtons, buttons.filesButtons)
                viewButtons(ctx, buttons.menuButtons, buttons.filesButtons)
                console.log(`Пользователь ${user.id} ${user.name} ${user.isAdmin ? 'admin' : 'user'} перешел в директорию: ${text}`)
            }
        }
    } catch (error) {
        console.log(error)
        ctx.reply('чтобы начать нажмите /start ')
    }
}

module.exports = process