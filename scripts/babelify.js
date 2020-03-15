const { exec, empty } = require('@baleada/prepare')

module.exports = function(dependency) {
  // fs.unlinkSync('index.js')
  // fs.unlinkSync('webpack.js')
  // fs.unlinkSync('rollup.js')
  exec(`npx babel src/${dependency}.js -o ${dependency}.js`)
}
