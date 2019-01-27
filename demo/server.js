const koa = require('koa'); // koa@2
const logger = require('koa-logger')
const koaRouter = require('koa-router') // koa-router@next
const koaStatic = require('koa-static')
const upload = require('./serverUpload')

const app = new koa()
const router = new koaRouter()

app.use(logger((str, args) => {
  console.log(str)
}))

router.get('/images', koaStatic(__dirname + '/__uploads__/images', { index: false }))
router.post('/upload', upload)

app.use(router.routes())
   .use(router.allowedMethods())

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('API listening on: ' + PORT)
})