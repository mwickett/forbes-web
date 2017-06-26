require('dotenv').config({ silent: true })

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-env')
const pageId = require('spike-page-id')
const DatoCMS = require('spike-datocms')
const marked = require('marked')
const axios = require('axios')
const googleMapsApiKey = process.env.GOOGLE_MAPS_KEY
const moment = require('moment')
const get = require('lodash.get')

const OfflinePlugin = require('offline-plugin')
const { UglifyJsPlugin } = require('webpack').optimize

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

function reverseLookup (lat, lon) {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleMapsApiKey}`)
    .then(function (response) {
      const results = response
      const address = results.data.results[0].formatted_address
      return address
    })
    .catch(function (error) {
      console.log(error)
    })
}

function getAddress (lat, lon) {
  return new Promise((resolve, reject) => {
    reverseLookup(lat, lon)
    .then(function (address) {
      resolve(address)
    })
    .catch(reject)
  })
}

// This is used to check if an event type has no event occurrences, and then display a "no events" placeholder
// It's using lodash.get to be able to check for an eventType.id inside of the event occurences
function doesItExist (arrayToScan, valueToCheck, pathToCheck) {
  // If the scan target is empty, bail out
  if (!arrayToScan) {
    return 0
  }
  const scanResults = arrayToScan.map((item) => {
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
          name: 'event_occurence',
          transform: (event) => {
            getAddress(event.eventLocation.latitude, event.eventLocation.longitude).then((res) => { event.eventLocation.address = res })
            return event
          }
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
    locals: (ctx) => { return Object.assign(locals, { pageId: pageId(ctx) }, { marked: marked }, {slugify: slugify}, {formatDate: formatDate}, { checkLength: checkLength }, { doesItExist: doesItExist }) },
    markdown: { linkify: false }
  }),
  postcss: cssStandards({
    minify: true,
    warnForDuplicates: false // cssnano includes autoprefixer
  }),
  babel: { presets: [[jsStandards, { modules: false }]], plugins: ['syntax-dynamic-import'] }
}
