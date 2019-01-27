const path = require('path')
const formidable = require('formidable')
const { promisify } = require('util')
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const unlinkAsync = promisify(fs.unlink)

const PORT = process.env.PORT || 3001

module.exports = async function (ctx) {
    var form = new formidable.IncomingForm()

    try {
      const result = await new Promise((resolve, reject) => {
        form.parse(ctx.req, async function(err, fields, files) {
          // `file` is the name of the <input> field of type `file`
          var old_path = files.file.path,
              file_size = files.file.size,
              file_ext = files.file.name.split('.').pop(),
              index = old_path.lastIndexOf('/') + 1,
              file_name = old_path.substr(index),
              new_path = path.join(__dirname, '__upload__', 'images', `${file_name}.${file_ext}`)
   
          console.log("[API] Storing file (" + file_name + ") at " + new_path)
        
          try {
            const data = await readFileAsync(old_path)
            await writeFileAsync(new_path, data)
            await unlinkAsync(old_path)
            
            return resolve({
              publicPath: `http://localhost:${PORT}/images/${file_name}.${file_ext}`
            })
          } catch (e) {
            return reject(e)
          }
        })
      })
      ctx.body = result
    } catch (e) {
      ctx.status = 500
    }
}
