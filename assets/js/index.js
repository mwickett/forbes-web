import mobileNav from './modules/nav.js'
require('offline-plugin/runtime').install()

document.addEventListener('DOMContentLoaded', function () {
  // Handle mobile nav dropdown
  mobileNav()
})
