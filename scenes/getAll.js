const {
    Scenes
} = require('telegraf')
const User = require('../User')

const getAll = new Scenes.BaseScene('getAll')
getAll.enter(async ctx => {
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
    const formattedUsers = users.map(user => `id: ${user.ID}, name: ${user.Name}, isAdmin: ${user.isAdmin}`)
    const usersString = formattedUsers.join('\n')
    console.log(usersString)
    await ctx.reply(usersString)
    ctx.scene.enter('manageUsers')

})

module.exports = getAll