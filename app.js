require('dotenv').config({ silent: true})

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-env')
const pageId = require('spike-page-id')
const Contentful = require('spike-contentful')
const marked = require('marked')

const locals = {}

// Used to convert anything to URL friendly slug
const slugify = function(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md', 'yarn.lock'],
  reshape: htmlStandards({
    locals: (ctx) => { return Object.assign(locals, { pageId: pageId(ctx) }, { marked: marked }, {typeKitId: process.env.TYPEKIT_ID}, {slugify: slugify}) }
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
              {
                name: 'services',
                id: 'service',
                filters: {
                  order: 'fields.order'
                }
              },
              {
                name: 'team',
                id: 'team',
                filters: {
                  order: 'fields.order'
                }
              },
              {
                name: 'events',
                id: 'event'
              },
              {
                name: 'basicPage',
                id: 'basicPage'
              }
          ],
          json: 'data/data.json'
      })
  ]
}
