const { exec, empty } = require('@baleada/prepare')

module.exports = function(dependency) {
  exec(`npx babel src/${dependency}.js -o ${dependency}.js`)
}
