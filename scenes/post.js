const {
  Scenes,
  Markup
} = require('telegraf')
const User = require('../User')
const post = new Scenes.BaseScene('post')
const keyboard = Markup.keyboard([
  ['Добавить фото'],
  ['Добавить видео'],
  ['Опубликовать'],
  ['Отмена'],
])
const keyboardSendOrCansel = Markup.keyboard([
  ['Опубликовать'],
  ['Отмена'],
])

post.enter((ctx) => {
  ctx.session.postText = ''
  ctx.reply('Введите текст поста:', keyboard)
})


post.hears('Добавить фото', (ctx) => {
  ctx.reply('Пришлите мне фото', keyboardSendOrCansel)
})

post.on('photo', (ctx) => {
  ctx.session.photo = ctx.message.photo;
  ctx.reply('Фото сохранено!')
})

post.hears('Добавить видео', (ctx) => {
  ctx.reply('Пришлите мне видео', keyboardSendOrCansel)
})

post.on('video', (ctx) => {
  ctx.session.video = ctx.message.video
  ctx.reply('Видео сохранено!')
})

post.hears('Опубликовать', async (ctx) => {
  const text = ctx.session.postText || ''

  let media = {
    type: 'text',
    media: {
      source: ''
    },
  }

  if (ctx.session.photo) {
    const photo = ctx.session.photo[ctx.session.photo.length - 1]
    media = {
      type: 'photo',
      media: {
        source: photo.file_id
      },
    }
  } else if (ctx.session.video) {
    media = {
      type: 'video',
      media: {
        source: ctx.session.video.file_id
      },
    }
  }

  const users = await User.getAll()
  for (let u of users) {
    const user = await User.getUserById(u.split('.')[0])
    const chatId = user.id
    if (chatId) {
      try {
        if (media.type === 'photo') {
          await ctx.telegram.sendPhoto(chatId, media.media.source, {
            caption: text,
          })
        } else if (media.type === 'video') {
          await ctx.telegram.sendVideo(chatId, media.media.source, {
            caption: text,
          })
        } else {
          await ctx.telegram.sendMessage(chatId, text)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  ctx.reply('Пост опубликован!')
  ctx.session.photo = null
  ctx.session.video = null
  ctx.scene.enter('admin')
});


post.hears('Отмена', (ctx) => {
  ctx.scene.enter('admin')
});

post.on('text', (ctx) => {
  ctx.session.postText = ctx.message.text
  ctx.reply('Выберите дальнейшие действия', keyboard)
})

module.exports = post;