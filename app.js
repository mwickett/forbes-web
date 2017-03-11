require('dotenv').config({ silent: true})

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-env')
const pageId = require('spike-page-id')
const Contentful = require('spike-contentful')
const marked = require('marked')
const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md', 'yarn.lock'],
  reshape: htmlStandards({
    locals: (ctx) => { return Object.assign(locals, { pageId: pageId(ctx) }, { marked: marked }) }
  }),
  postcss: cssStandards(),
  babel: { presets: [[jsStandards, { modules: false }]] },
  plugins: [
      new Contentful({
          addDataTo: locals,
          accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
          spaceId: process.env.CONTENTFUL_SPACE_ID,
          contentTypes: [
              {
                  name: 'home',
                  id: 'home',
              },
              {
                  name: 'contactPage',
                  id: 'contactPage',
              },
          ],
          json: 'data/data.json'
      })
  ]
}
