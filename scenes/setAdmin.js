const {
    Scenes,
    Markup
} = require("telegraf")
const User = require('../User')

const setAdmin = new Scenes.BaseScene('setAdmin')
const keyDone = Markup.keyboard([
    ['Готово']
])
const keyCancel = Markup.keyboard([
    ['Отмена']
])

setAdmin.enter(ctx => ctx.reply('Введите ID пользователя:', keyCancel))


setAdmin.on('message', async ctx => {
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
                const id = Number(ctx.update.message.text)
                if (!isNaN(id)) {
                    const user = await User.getUserById(id)
                    if (user) {
                        await User.saveUser(id, true)
                        ctx.reply(`Пользователь с ID: ${id} получил права администратора`)
                        ctx.reply(`Введите следующий ID пользователя, либо нажмите "Готово" для выхода в главное меню`, keyDone)
                    } else {
                        ctx.reply(`Такого пользователя не существует`, keyCancel)
                    }
                } else {
                    ctx.reply(`Невозможно идентифицировать пользователя ${id}. Проверьте вводимые данные. Введите id пользователя (числовое значение)`, keyDone)
                }
            } catch (error) {
                console.log(error)
                ctx.reply('Произошла ошибка')
            }
            break
    }
})

module.exports = setAdmin