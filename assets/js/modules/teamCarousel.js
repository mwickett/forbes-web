function teamCarousel () {
  function getTeamMembers () {
    const teamMembers = Array.from(document.getElementsByClassName('s-team-carousel-member'))
    return teamMembers
  }

  function onMount () {
    const teamMembers = getTeamMembers()
    teamMembers.forEach((teamMember, i) => {
      // If it's the first one, we want it displayed to start
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

    teamMembers.every((teamMember, i, array) => {
      console.log("Counter: " + i + teamMember)
      if (nextActive === true) {
        setNextActive(teamMember)
        return true
      }

      if (teamMember.classList.contains('js-active')) {
        teamMember.classList.remove('js-active')
        teamMember.classList.add('js-inactive')
        // If it's the last one active, we need to start over, otherwise set the next one to be activated
        if (i === (array.length) - 1) {
          setNextActive(teamMembers[0])
        } else {
          nextActive = true
        }
      }
      return true
    })
  }
  // Initial startup
  onMount()
  // Button triggers advance() function above
  document.getElementById('nextTeamMember').addEventListener('click', advance, false)
}

export default teamCarousel
