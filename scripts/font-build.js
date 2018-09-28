const fs = require('fs-extra')
const path = require('path')
const expand = require('glob-expand')
const webfont = require('webfont').default

const files = expand(
  {
    cwd: process.cwd()
  },
  'src/svgs/**/*.svg'
)

const config = {
  files,
  fontName: 'warhammer40k',
  baseClass: 'wh40k',
  classPrefix: 'wh40k-',
  fontHeight: 128,
  normalize: true,
  formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
  glyphTransformFn: obj => {
    return obj
  }
}

webfont({
  ...config,
  template: path.join('./src/css.hbs')
}).then(result => {
  fs.ensureDir('dist', error => {
    if (error) {
      logger.error(error)
    } else {
      webfont({
        ...config,
        template: path.join('./src/scss.hbs')
      }).then(result => {
        fs.writeFileSync(`variables.scss`, result.template)
      })

      fs.writeFileSync(`dist/${result.config.fontName}.css`, result.template)
      fs.writeFileSync(`dist/${result.config.fontName}.svg`, result.svg)
      fs.writeFileSync(`dist/${result.config.fontName}.ttf`, new Buffer.from(result.ttf))
      fs.writeFileSync(`dist/${result.config.fontName}.eot`, new Buffer.from(result.eot))
      fs.writeFileSync(`dist/${result.config.fontName}.woff`, new Buffer.from(result.woff))
      fs.writeFileSync(`dist/${result.config.fontName}.woff2`, new Buffer.from(result.woff2))
    }
  })
})