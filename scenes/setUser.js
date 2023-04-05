const {
    Scenes,
    Markup
} = require("telegraf")
const User = require('../User')

const setUser = new Scenes.BaseScene('setUser')
const keyDone = Markup.keyboard([
    ['Готово']
])
const keyCancel = Markup.keyboard([
    ['Отмена']
])

setUser.enter(ctx => ctx.reply('Введите ID пользователя: ', keyCancel))


setUser.on('message', async ctx => {
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
                    const user = await User.getUserById(id)
                    if (user) {
                        await User.saveUser(id, false)
                        ctx.reply(`Пользователь с ID: ${id} без прав администратора`)
                        ctx.reply(`Введите следующий ID пользователя, либо нажмите "Готово" для выхода в главное меню`, keyDone)
                    } else {
                        ctx.reply(`Такого пользователя не существует`)
                        ctx.scene.reenter('setUser')
                    }
                } else {
                    ctx.reply(`Невозможно идентифицировать пользователя ${id}. Проверьте вводимые данные. Введите id пользователя (числовое значение)`, keyboard)
                }
            } catch (error) {
                console.log(error)
                ctx.reply('Произошла ошибка')
            }

    }
})

module.exports = setUser