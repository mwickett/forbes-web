function teamCarousel () {
  const teamWrapper = document.querySelector('.s-team-carousel')

  function getTeamMembers () {
    const teamMembers = Array.from(document.getElementsByClassName('s-team-carousel-member'))
    return teamMembers
  }

  function onMount () {
    console.log('Booting up team carousel')
    const teamMembers = getTeamMembers()
    teamMembers.forEach((teamMember, i) => {
      // If it's the first one, we want it displayed
      if (i === 0) {
        teamMember.classList.add('js-active')
      } else {
        teamMember.classList.add('js-inactive')
      }
    })
  }

  function advance () {
    let nextActive = false

    const teamMembers = getTeamMembers()
    console.log("length: " + teamMembers.length)
    console.log(teamMembers)

    function setNextActive (itemToActivate) {
      nextActive = false
      itemToActivate.classList.remove('js-inactive')
      itemToActivate.classList.add('js-active')
    }

    teamMembers.every((teamMember, i) => {
      if (nextActive === true) {
        if (i === (teamMembers.length - 1)) {
          setNextActive(teamMembers[0])
        } else {
          setNextActive(teamMember)
        }
        return false
      }

      if (teamMember.classList.contains('js-active')) {
        console.log('poop')
        teamMember.classList.remove('js-active')
        teamMember.classList.add('js-inactive')
        nextActive = true
      }
      return true
    })
  }

  onMount()
  teamWrapper.addEventListener('click', advance)
}

export default teamCarousel
