function teamCarousel () {

  function getTeamMembers () {
    const teamMembers = Array.from(document.getElementsByClassName('s-team-carousel-member'))
    return teamMembers
  }

  function onMount () {
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

  function advance (e) {
    let nextActive = false

    const teamMembers = getTeamMembers()

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
        teamMember.classList.remove('js-active')
        teamMember.classList.add('js-inactive')
        nextActive = true
      }
      return true
    })
  }

  onMount()
  document.getElementById('nextTeamMember').addEventListener('click', advance, false)
}

export default teamCarousel
