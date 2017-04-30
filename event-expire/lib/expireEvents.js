const contentful = require('contentful-management')
const moment = require('moment')

const dateNow = moment().format('YYYY-MM-DDThh:mm:ssZ')

module.exports = (event, context, callback) => {
  const client = contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  .then((space) => {
    return space.getEntries({
      'content_type': 'event',
      'fields.dateTime[lte]': dateNow,
      'sys.publishedAt[exists]': true
    })
  })
  .then((entries) => {
    return Promise.all(entries.items.map((entry) => {
      return entry.unpublish()
    }))
  })
  .then((events) => {
    return Promise.all(events.map((event) => {
      return event.archive()
    }))
  })
  .then((result) => {
    const eventsExpired = result.length
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Expired ' + eventsExpired + ' events.'
      })
    })
  })
  .catch((e) => {
    callback(e)
  })
}
