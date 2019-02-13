const axios = require('axios')

module.exports = async function (ctx) {
  try {
    const res = await axios.get(ctx.query.uri)
    return ctx.body = {
      htmlBody: res.data
    }
  } catch (e) {
    throw e
  }
}