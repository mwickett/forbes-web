require('dotenv').config({ silent: true })

const contentfulManagement = require('contentful-management')
const spaceID = process.env.CONTENTFUL_SPACE_ID


module.exports = async (eventId) => {
  const client = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  client.getSpace(spaceID)
  .then((space) => {
    space.getEntry(eventId)
    .then((entry) => {
      entry.unpublish()
      .then((entry) => {
        console.log('UNPUBLISHED' + entry.sys.id)
        return 'unpublished'
      })
      .catch((e) => {
        const message1 = "First catch " + e
        return message1
      })
    })
  })
  .catch((e) => {
    const message2 = "Second catch " + e
    return message2
  })
}
