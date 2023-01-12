const Koa = require('koa')
const cors = require('@koa/cors')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const { getOne, catalog, getCatalogue } = require('./book')
const { login, register, jwtAuthentication } = require('./login')
const { models, init } = require('./model')
const getAvatarImg = require('./model/getAvatarImg')

async function main() {
  const app = new Koa()
  app.use(cors())
  app.use(bodyParser())

  await init()

  router.get('/home', async (ctx) => {
    if (ctx.query.url) {
      ctx.body = await getCatalogue(JSON.parse(ctx.query.url))
    }
  })

  router.get('/catalogue', async (ctx) => {
    if (ctx.query.url) {
      ctx.body = await catalog(ctx.query.url)
    }
  })

  router.get('/chapter', async (ctx) => {
    if (ctx.query.url) {
      ctx.body = await getOne(ctx.query.url)
    }
  })

  router.post('/login', async (ctx) => {
    ctx.body = await login(ctx.request.body)
  })

  router.post('/register', async (ctx) => {
    ctx.body = await register(ctx.request.body)
  })

  router.post('/authentication', async (ctx) => {
    ctx.body = await jwtAuthentication(ctx.request.body)
  })

  router.post('/uploadImg', models.upload.single('avatar'), async (ctx) => {
    const file = ctx.request.file
    const userName = ctx.request.body.userName
    const res = await models.userModel.updateAvatarPath(userName, file.path)
    if (res) {
      console.log('头像更新成功')
      ctx.body = { path: file.path }
    }
  })

  router.get('/getAvatarImg', async (ctx) => {
    ctx.body = await getAvatarImg(ctx.query.path)
  })

  app.use(router.routes()) //启动路由
  app.use(router.allowedMethods()) //请求出错时的处理逻辑
  app.listen(8000, '0.0.0.0')
}
main()
