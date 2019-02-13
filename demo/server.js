const koa = require('koa'); // koa@2
const logger = require('koa-logger')
const koaRouter = require('koa-router') // koa-router@next
const koaStatic = require('koa-static')
const upload = require('./serverUpload')
const scrape = require('./serverScrape')

const app = new koa()
const router = new koaRouter()

app.use(logger((str, args) => {
  console.log(str)
}))

router.post('/upload', upload)
router.get('/scrape', scrape)

app.use(router.routes())
   .use(router.allowedMethods())

app.use(async (ctx, next) => {
  await koaStatic(__dirname + '/__upload__', { index: false })(ctx, next)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log('API listening on: ' + PORT)
})