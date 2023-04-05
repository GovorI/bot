const {
    Scenes
} = require('telegraf')
const path = require('path')
const User = require('../User')
const dataFilePath = path.join(__dirname, '../data')

const addUser = new Scenes.BaseScene('addUser')
const keyDone = [
    [{
        'text': 'Готово',
        'callback_data': dataFilePath
    }]
]
const keyCancel = [
    [{
        'text': 'Отмена',
        'callback_data': dataFilePath
    }]
]


addUser.enter(ctx => ctx.reply('Введите ID пользователя для добавления', {
    reply_markup: JSON.stringify({
        keyboard: keyCancel
    })
}))
addUser.on('message', async ctx => {
    const text = ctx.update.message.text
    const id = Number(text)

    switch (text) {
        case 'Готово':
            ctx.scene.enter('manageUsers')
            break
        case 'Отмена':
            ctx.scene.enter('manageUsers')
            break
        case '/start':
            ctx.scene.enter('start')
            break
        default:
            try {
                if (!isNaN(id)) {
                    if (!await User.getUserById(id)) {
                        await User.saveUser(id, false, "no_name", dataFilePath)
                        await ctx.reply(`Пользователь с ID: ${id} успешно добавлен`)
                        try {
                            await ctx.reply('Вы успешно добавлены в чат', {
                                chat_id: id
                            })
                        } catch (error) {
                            console.log(error)
                        }
                        await ctx.reply(`Введите следующий ID пользователя для добавления, либо нажмите "Готово" для выхода в главное меню`, {
                            reply_markup: JSON.stringify({
                                keyboard: keyDone
                            })
                        })
                    } else {
                        ctx.reply(`Такой пользователь уже существует`, {
                            reply_markup: JSON.stringify({
                                keyboard: keyCancel
                            })
                        })
                    }
                } else {
                    ctx.reply(`Невозможно добавить пользователя ${id}. Проверьте вводимые данные. Введите id пользователя (числовое значение)`, {
                        reply_markup: JSON.stringify({
                            keyboard: keyDone
                        })
                    })
                }
            } catch (error) {
                console.log(error)
                ctx.reply('Произошла ошибка при добавлении пользователя')
            }

    }

})

module.exports = addUser