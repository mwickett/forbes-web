import mobileNav from './modules/nav.js'
//import teamCarousel from './modules/teamCarousel'
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

document.addEventListener('DOMContentLoaded', function () {
  // GLOBAL LOADS
  // Handle mobile nav dropdown
  mobileNav()

  const currentPage = getPageId()

  switch(currentPage) {
    case 'index':
      loadIndex()
      break
    case 'how-we-help':
      break
    case 'meet-our-team':
      break
  }
})
