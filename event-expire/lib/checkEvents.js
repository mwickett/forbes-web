require('dotenv').config({ silent: true})

const contentful = require('contentful')
const moment = require('moment')

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
})

let expiredEvents = []

client.getEntries({
  'content_type' : 'event'
})
.then(function (entries) {
  entries.items.forEach((entry) => {
    const eventDate = moment(entry.fields.dateTime, "YYYY-MM-DDThh:mm:ss-HH:mm")
    const currentDate = moment().format("YYYY-MM-DDThh:mm:ss-HH:mm")
    if (moment(eventDate).isBefore(currentDate)) {
      console.log(entry.sys.id)
      expiredEvents.push(entry.sys.id)
    }
  })
})
.then(console.log(expiredEvents))


// Get events from Contentful

// Parse them

// Check dates on each

// If date has passed, grab the id

// Tell Contentful to set that post id status to unpublished

// Hit Netlify build webhook
