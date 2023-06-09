const {
  Scenes
} = require('telegraf')
const User = require('../User')

const getAll = new Scenes.BaseScene('getAll')
getAll.enter(async ctx => {
  try {
    await ctx.reply('Информация о пользователях:')
    const list = await User.getAll()
    let users = []
    if (list.length > 0) {
      for (let u of list) {
        if (u.split('.')[1] === 'json') {
          const user = await User.getUserById(u.split('.')[0])
          users.push({
            ID: user.id,
            Name: user.name,
            isAdmin: user.isAdmin
          })
        }
      }
    }
    let message = ''
    const MAX_MESSAGE_LENGTH = 4000
    for (let user of users) {
      const userString = `id: ${user.ID}, name: ${user.Name}, ${user.isAdmin ? 'admin' : 'user'}\n`
      if (message.length + userString.length > MAX_MESSAGE_LENGTH) {
        await ctx.reply(message)
        message = userString
      } else {
        message += userString
      }
    }
    if (message) {
      await ctx.reply(message)
    }
    console.log(message)


    ctx.scene.enter('manageUsers')

  } catch (error) {
    console.log(error)
  }
})

module.exports = getAll