const {
    Scenes,
    Markup
} = require('telegraf')


const manageUsers = new Scenes.BaseScene('manageUsers')
const keyboard = Markup.keyboard([
    ['Добавить пользователя'],
    ['Удалить пользователя'],
    ['Список пользователей'],
    ['Предоставить права администратора'],
    ['Забрать права администратора'],
    ['Выход']
])

manageUsers.enter(ctx => {
    ctx.reply('Управление пользователями', keyboard)
})

manageUsers.hears('Добавить пользователя', (ctx) => {
    ctx.scene.enter('addUser')
})

manageUsers.hears('Удалить пользователя', (ctx) => {
    ctx.scene.enter('delUser')
})

manageUsers.hears('Список пользователей', (ctx) => {
    ctx.scene.enter('getAll')
})

manageUsers.hears('Предоставить права администратора', (ctx) => {
    ctx.scene.enter('setAdmin')
})

manageUsers.hears('Забрать права администратора', (ctx) => {
    ctx.scene.enter('setUser')
})

manageUsers.hears('Выход', (ctx) => {
    ctx.scene.enter('admin')
})

module.exports = manageUsers