require('dotenv').config({ silent: true })

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-env')
const pageId = require('spike-page-id')
const Contentful = require('spike-contentful')
const marked = require('marked')
const moment = require('moment')

const OfflinePlugin = require('offline-plugin')
const {UglifyJsPlugin} = require('webpack').optimize

const locals = {}

// Used to convert anything to URL friendly slug
const slugify = function (text) {
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

function checkLength (item) {
  return item.length
}

// Clean up data & time format
function formatDate (dateTime) {
  const cleanDate = moment(dateTime).format('dddd, MMMM Do YYYY, h:mm a')
  return cleanDate
}

module.exports = {
  // disable source maps
  devtool: false,
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md', 'yarn.lock', 'serverless/**', 'services/**'],
  plugins: [
      // webpack optimization and service worker
    new UglifyJsPlugin(),
    new OfflinePlugin({ updateStrategy: 'all' }),
    new Contentful({
      addDataTo: locals,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      contentTypes: [
        {
          name: 'home',
          id: 'home'
        },
        {
          name: 'contactPage',
          id: 'contactPage'
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
          id: 'event',
          filters: {
            order: 'fields.dateTime'
          }
        },
        {
          name: 'homePageEvents',
          id: 'event',
          filters: {
            order: 'fields.dateTime',
            limit: 3
          }
        },
        {
          name: 'basicPage',
          id: 'basicPage'
        },
        {
          name: 'officeCarousel',
          id: 'imageCarousel'
        }
      ]
    })
  ],
  // image optimization
  module: {
    rules: [{
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [{ loader: 'image-webpack-loader' }]
    }]
  },
  // minify html and css
  reshape: htmlStandards({
    minify: false,
    locals: (ctx) => { return Object.assign(locals, { pageId: pageId(ctx) }, { marked: marked }, {slugify: slugify}, {formatDate: formatDate}, { checkLength: checkLength }) },
    markdown: { linkify: false }
  }),
  postcss: cssStandards({
    minify: true,
    warnForDuplicates: false // cssnano includes autoprefixer
  }),
  babel: { presets: [[jsStandards, { modules: false }]], plugins: ['syntax-dynamic-import'] }
}
