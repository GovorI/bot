const fs = require('fs')
const path = require('path')
const User = require('../User')

function getFiles(path, files_) {
    try {
        files_ = files_ || []
        var files = fs.readdirSync(path)
        for (var i in files) {
            var name = path + '/' + files[i]
            files_.push(name)
        }
        return files_
    } catch (error) {
        console.log(error)
    }
}

async function createButtons(_path) {
    console.log('path --->'+_path)
    let files = await getFiles(_path)
    let menuButtons = []
    let filesButtons = []
    let i = 0
    filesPath = []
    files.forEach(element => {
        let text = element.split('/')
        if (fs.statSync(element).isDirectory()) {
            menuButtons.push([{
                'text': text[text.length - 1],
                'callback_data': element
            }])
        } else if (fs.statSync(element).isFile()) {
            filesButtons.push([{
                'text': text[text.length - 1],
                'callback_data': i.toString()
            }])
            filesPath.push({
                id: i.toString(),
                path: element
            })
            i++
        }
    });

    if (_path !== path.join(__dirname, '../', 'data')) {
        menuButtons.push([{
            'text': 'Главное меню',
            'callback_data': `${path.join(__dirname, '../', 'data')}`
        }])
    }
    return {
        menuButtons: menuButtons,
        filesButtons: filesButtons
    }
}

function viewButtons(ctx, menuButtons, filesButtons) {
    ctx.reply('Выберите пункт меню', {
        reply_markup: JSON.stringify({
            keyboard: menuButtons
        })
    })
    if (filesButtons.length > 0) {
        ctx.reply('Выберите файл', {
            reply_markup: JSON.stringify({
                inline_keyboard: filesButtons
            })
        })
    }
}

async function sendFile(ctx, fileId) {
    const id = Number(ctx.update.callback_query.from.id)
    let user = await User.getUserById(id)
    let buttons = user.filesButtons
    try {
        let button = await buttons[fileId]
        let ext = button[0].text.split('.')[1]
        let filePath = user.path.toString()
        filePath = path.join(filePath, button[0].text.toString())
        if (ext === ('mp4' || 'avi')) {
            ctx.reply('Загрузка видео...')
            const video = fs.createReadStream(filePath)
             await ctx.telegram.sendVideo(ctx.chat.id, {
                source: video
            })
        } else {
             ctx.replyWithDocument({
                source: filePath,
                filename: button[0].text.toString()
            });

        }
        console.log(`Пользователь: ${user.id} ${user.name} ${user.isAdmin ? 'admin' : 'user'} получил файл: ${filePath}`)
    } catch (error) {
        console.log(error)
        ctx.reply('Ошибка загрузки файла, попробуйте снова')
        ctx.scene.enter('start')

    }
}

module.exports = {
    createButtons,
    viewButtons,
    sendFile
}