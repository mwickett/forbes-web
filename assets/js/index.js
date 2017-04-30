import mobileNav from './modules/nav.js'
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

function loadTinySlider () {
  import('tiny-slider')
    .then((module) => {
      console.log(module.default())
    })
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
      loadTinySlider()
      break
    case 'meet-our-team':
      break
  }
})
