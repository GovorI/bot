const {
    Scenes
} = require('telegraf')
const User = require('../User')
const path = require('path')
const dataFilePath = path.join(__dirname, '../data')

const deleteUser = new Scenes.BaseScene('delUser')

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

deleteUser.enter(ctx => ctx.reply('Введите ID пользователя для удаления', {
    reply_markup: JSON.stringify({
        keyboard: keyCancel
    })
}))

deleteUser.on('message', async ctx => {
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
                    if (await User.deleteUser(id)) {
                        ctx.reply(`Пользователь с ID: ${id} успешно удален`)
                        ctx.reply(`Введите следующий ID пользователя для удаления, либо нажмите "Готово" для выхода в главное меню`, {
                            reply_markup: JSON.stringify({
                                keyboard: keyDone
                            })
                        })
                    } else {
                        ctx.reply(`Такого пользователя не существует`, {
                            reply_markup: JSON.stringify({
                                keyboard: keyCancel
                            })
                        })
                    }
                } else {
                    ctx.reply(`Невозможно удалить пользователя ${id}. Проверьте вводимые данные. Введите id пользователя (числовое значение)`, {
                        reply_markup: JSON.stringify({
                            keyboard: keyDone
                        })
                    })
                }
            } catch (error) {
                console.log(error)
                ctx.reply('Произошла ошибка при удалении пользователя')
            }

    }

})


module.exports = deleteUser