require('dotenv').config({ silent: true })

// Checks Contentful event content types for their eventDate and if they are before the current day, calls to
// unpublishEevnt(id, finished) to unpublish the event fron Contentful
const contentful = require('contentful')
const moment = require('moment')
const unpublishEvent = require('./unpublishEvent')

const spaceID = process.env.CONTENTFUL_SPACE_ID

const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: spaceID
})

client.getEntries({
  'content_type': 'event'
})
.then((entries) => {
  const eventsForExpiry = entries.items.filter((entry) => {
    const eventDate = moment(entry.fields.dateTime, 'YYYY-MM-DDThh:mm:ss-HH:mm')
    const currentDate = moment().format('YYYY-MM-DDThh:mm:ss-HH:mm')
    if (moment(eventDate).isBefore(currentDate)) {
      return true
    } else {
      return false
    }
  })

  Promise.all(eventsForExpiry.map(async (event) => {
    const results = await unpublishEvent(event.sys.id)
    console.log(results)
  })
  )
})
.catch((e) => {
  console.log('There was an error ' + e)
})
