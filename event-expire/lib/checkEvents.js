require('dotenv').config({ silent: true})

const contentful = require('contentful')
const moment = require('moment')
const unpublishEvent = require('./unpublishEvent')

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
})

let expiredEvents = []

function addIdToExpire (id) {
  expiredEvents.push(id)
  console.log(expiredEvents)
}

function finished (content) {
  console.log("Unpublished event" + content)
}

client.getEntries({
  'content_type' : 'event'
})
.then(function (entries) {
  entries.items.forEach((entry) => {
    const id = entry.sys.id
    const eventDate = moment(entry.fields.dateTime, "YYYY-MM-DDThh:mm:ss-HH:mm")
    const currentDate = moment().format("YYYY-MM-DDThh:mm:ss-HH:mm")
    if (moment(eventDate).isBefore(currentDate)) {
      unpublishEvent(id, finished)
    }
  })
}).catch((e) => {
  console.log("There was an error " + e)
})


// Get events from Contentful

// Parse them

// Check dates on each

// If date has passed, grab the id

// Tell Contentful to set that post id status to unpublished

// Hit Netlify build webhook
