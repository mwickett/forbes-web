import mobileNav from './modules/nav.js'
import Sticky from 'sticky-js'
require('offline-plugin/runtime').install()

function getPageId () {
  const pageId = document.querySelector('main')
  console.log(pageId.id.toLowerCase())
  return pageId.id.toLowerCase()
}

function loadIndex () {
  import('./modules/teamCarousel')
    .then(module => module.default())
    .catch(err => console.log('Failed to load index scripts', err))
}

function loadSiema () {
  import('siema')
    .then((Siema) => {
      const mySiema = new Siema()

      const prev = document.querySelector('.prev')
      const next = document.querySelector('.next')

      prev.addEventListener('click', () => mySiema.prev())
      next.addEventListener('click', () => mySiema.next())
    })
}

document.addEventListener('DOMContentLoaded', function () {
  // GLOBAL LOADS
  // Handle mobile nav dropdown
  mobileNav()
  const sticky = new Sticky('.sticky')

  const currentPage = getPageId()

  switch(currentPage) {
    case 'index':
      loadIndex()
      break
    case 'how-we-help':
      loadSiema()
      break
    case 'meet-our-team':
      break
  }
})
