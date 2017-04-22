
function mobileNav () {
  function toggleNav (e) {
    if (navActive === true) {
      nav.style.display = 'none'
      navActive = false
    } else {
      nav.style.display = 'block'
      navActive = true
    }
  }

  let navActive = false
  const nav = document.getElementById('nav')
  const navButton = document.getElementById('navLink')
  navButton.addEventListener('click', toggleNav)
}

export default mobileNav
