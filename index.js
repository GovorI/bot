const {
    Telegraf,
    Scenes,
    session
} = require('telegraf')
require('dotenv').config()
const User = require('./User')

const bot = new Telegraf(process.env.BOT_TOKEN, {
    commandParts: true
})

const startScene = require('./scenes/start')
const postScene = require('./scenes/post')
const processScene = require('./scenes/process')
const addUserScene = require('./scenes/addUser')
const delUserScene = require('./scenes/delUser')
const getAllScene = require('./scenes/getAll')
const adminScene = require('./scenes/admin')
const manageUsers = require('./scenes/manageUsers')
const setAdmin = require('./scenes/setAdmin')
const setUser = require('./scenes/setUser')

const stage = new Scenes.Stage([startScene, processScene, addUserScene, delUserScene,
    getAllScene, postScene, adminScene, manageUsers, setAdmin, setUser
])
bot.use(session())
bot.use(stage.middleware())
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
})

const commands = [{
    command: 'start',
    description: 'Начать работу с ботом'
},
{
    command: 'admin',
    description: 'Меню администратора'
}
]

bot.telegram.setMyCommands(commands)

bot.command('/start', async ctx => {
    ctx.scene.enter('start')
})
bot.command('/admin', async ctx => {
    const id = Number(ctx.update.message.from.id)
    const user = await User.getUserById(id)
    if (user.isAdmin) {
        ctx.scene.enter('admin')
    }
})
bot.on('message', ctx => {
    ctx.reply('Нажмите "/start", чтобы начать')
})

bot.launch()