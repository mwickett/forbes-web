require('dotenv').config({ silent: true })

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-env')
const pageId = require('spike-page-id')
const DatoCMS = require('spike-datocms')
const marked = require('marked')
const moment = require('moment-timezone')
const get = require('lodash.get')
const sugarml = require('sugarml')
const sugarss = require('sugarss')

// const OfflinePlugin = require('offline-plugin')
const { UglifyJsPlugin } = require('webpack').optimize
// const PushState = require('spike-pushstate')
const optimize = require('spike-optimize')

const locals = {}

// Used to convert anything to URL friendly slug
const slugify = function(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

function checkLength(item) {
  return item.length
}

// This is used to check if an event type has no event occurrences, and then display a "no events" placeholder
// It's using lodash.get to be able to check for an eventType.id inside of the event occurences
function doesItExist(arrayToScan, valueToCheck, pathToCheck) {
  // If the scan target is empty, bail out
  if (arrayToScan.length === 0) {
    return 0
  }
  const scanResults = arrayToScan.map(item => {
    const check = get(item, pathToCheck, 0)
    if (check === valueToCheck) {
      return 1
    } else {
      return 0
    }
  })
  // Because our results are an array of 1 or 0, we can reduce down to know if there are any results
  return scanResults.reduce((acc, val) => acc + val)
}

// Clean up data & time format
function formatDate(dateTime, format) {
  const cleanDate = moment(dateTime)
    .tz('America/Toronto')
    .format(format)
  return cleanDate
}

module.exports = {
  // disable source maps
  root: './',
  devtool: false,
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: [
    '**/layout.sgr',
    '**/_*',
    '**/.*',
    '_cache/**',
    'readme.md',
    'yarn.lock',
    'serverless/**',
    'services/**'
  ],
  plugins: [
    // webpack optimization and service worker
    // new PushState({ files: '**/*.sgr' }),
    new DatoCMS({
      addDataTo: locals,
      token: process.env.DATO_CMS_TOKEN,
      models: [
        {
          name: 'cta_block'
        },
        {
          name: 'contact_page'
        },
        {
          name: 'event_type'
        },
        {
          name: 'event_page'
        },
        {
          name: 'event_occurence'
        },
        {
          name: 'home_page'
        },
        {
          name: 'service'
        },
        {
          name: 'services_page'
        },
        {
          name: 'team'
        },
        {
          name: 'team_page'
        },
        {
          name: 'blog',
          template: {
            path: 'views/blog/single.sgr',
            output: post => {
              return `blog/${post.slug}.html`
            }
          },
          transform: record => {
            if (record.blogImage) {
              record.blogImagePath = record.blogImage.path
            }
            return record
          }
        },
        {
          name: 'blog_list_page',
          transform: record => {
            if (record.headerImage) {
              record.headerImagePath = record.headerImage.path
            }
            return record
          }
        }
      ]
    }),
    new UglifyJsPlugin()
    // new OfflinePlugin({ updateStrategy: 'all' })
  ],
  // image optimization
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{ loader: 'image-webpack-loader' }]
      }
    ]
  },
  // minify html and css
  reshape: htmlStandards({
    minify: false,
    locals: ctx => {
      return Object.assign(
        locals,
        { pageId: pageId(ctx) },
        { marked: marked },
        { slugify: slugify },
        { formatDate: formatDate },
        { checkLength: checkLength },
        { doesItExist: doesItExist }
      )
    },
    markdown: { linkify: false },
    parser: sugarml,
    root: './views'
  }),
  postcss: cssStandards({
    minify: true,
    warnForDuplicates: false, // cssnano includes autoprefixer
    parser: sugarss
  }),
  babel: {
    presets: [[jsStandards, { modules: false }]],
    plugins: ['syntax-dynamic-import']
  },
  afterSpikePlugins: [
    ...optimize({
      scopeHoisting: true,
      minify: true,
      aggressiveSplitting: true // or set your size limits ex. [30000, 50000]
    })
  ]
}
