const {
  Scenes,
  Markup
} = require('telegraf')
const admin = new Scenes.BaseScene('admin')
const User = require('../User')
const keyboard = Markup.keyboard([
  ['Управление пользователями'],
  ['Написать пост'],
  ['Выход']
])

admin.enter(async (ctx) => {
  ctx.reply('Меню администратора', keyboard)
})

admin.hears('Управление пользователями', (ctx) => {
  ctx.scene.enter('manageUsers')
})

admin.hears('Написать пост', (ctx) => {
  ctx.scene.enter('post')
})

admin.hears('Выход', (ctx) => {
  ctx.scene.enter('process')
})

module.exports = admin