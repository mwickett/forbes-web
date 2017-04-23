import mobileNav from './modules/nav.js'
import teamCarousel from './modules/teamCarousel'
require('offline-plugin/runtime').install()

document.addEventListener('DOMContentLoaded', function () {
  // Handle mobile nav dropdown
  mobileNav()
  // Fire up team carousel
  teamCarousel()
})
