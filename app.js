require('dotenv').config({ silent: true})

const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-env')
const pageId = require('spike-page-id')
const Contentful = require('spike-contentful')
const marked = require('marked')
const axios = require('axios')
const googleMapsApiKey = process.env.GOOGLE_MAPS_KEY
const moment = require('moment')


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

function reverseLookup(lat, lon) {
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleMapsApiKey}`)
    .then(function (response) {
      const results = response
      const address = results.data.results[0].formatted_address
      return address
    })
    .catch(function(error){
      console.log(error)
    })
}

function getAddress(lat, lon) {
  return new Promise((resolve, reject) => {
    reverseLookup(lat, lon)
    .then(function(address) {
      resolve(address)
    })
    .catch(reject)
  })
}

// Clean up data & time format
function formatDate(dateTime) {
  const cleanDate = moment(dateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")
  return cleanDate
}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md', 'yarn.lock'],
  reshape: htmlStandards({
    locals: (ctx) => { return Object.assign(locals, { pageId: pageId(ctx) }, { marked: marked }, {typeKitId: process.env.TYPEKIT_ID}, {slugify: slugify}, {formatDate: formatDate}) }
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
                  transform: (home) => {
                    const event = home.fields.homeEvents
                    event.forEach((event) => {
                      const lat = event.fields.location.lat
                      const lon = event.fields.location.lon
                      getAddress(lat, lon).then((res) => {event.fields.location.address = res})
                    })
                    return home
                  }
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
                id: 'event',
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
