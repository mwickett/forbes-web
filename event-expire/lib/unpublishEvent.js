require('dotenv').config({ silent: true})

const contentfulManagement = require('contentful-management')
const spaceID = process.env.CONTENTFUL_SPACE_ID


module.exports = (eventId, callback) => {
  console.log(eventId)
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  client.getSpace(spaceID)
  .then((space) => {
    space.getEntry(eventId)
    .then((entry) => {
      entry.unpublish()
      .then((entry) => callback(entry.sys.id))
    })
  })
}
