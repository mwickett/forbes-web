const url = 'https://m5pun1fvqc.execute-api.us-east-1.amazonaws.com/testing/contact'

function contactForm () {
  const form = document.querySelector('form.contact-form')
  const submit = form.querySelector('button')
  submit.disabled = true

  let nameField = form.querySelector('input#name')
  let emailField = form.querySelector('input#email')
  let messageField = form.querySelector('input#message')
  let botField = form.querySelector('input#bot-field')
  let feedBackMessage = form.querySelector('span.formStatus')



  function clearForm () {
    nameField.value = ''
    emailField.value = ''
    messageField.value = ''
    submit.disabled = false
  }

  function displayMessage (field, message) {
    field.innerHTML = message
    field.classList.remove('hidden')
  }

  function sendFormData (data) {
    const payload = JSON.stringify(data)
    const request = new XMLHttpRequest()
    request.open('POST', url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    request.send(payload)
    request.onreadystatechange = () => {
      switch (request.readyState) {
        case 0:
          console.log('Not opened yet')
          break
        case 1:
          console.log('Opened')
          break
        case 2:
          console.log('Headers')
          break
        case 3:
          console.log('Loding')
          break
        case 4:
          if (request.status === 200) {
            console.log('Submitted successfully')
            displayMessage(feedBackMessage, "It's been sent! We'll be in touch soon")
            clearForm()
          } else {
            displayMessage(feedBackMessage, "Something went wrong. Please try again")
            console.log('Something went wrong with the server')
          }
          break
      }
    }
  }

  function getFormData (e) {
    e.preventDefault()

    // Check if bot field has a value, if it does, don't send.
    if (botField.value) {
      clearForm()
      console.log("Bot-field filled - submission rejected")
      return
    }

    const data = {
      name: form.querySelector('input#name').value.trim(),
      email: form.querySelector('input#email').value.trim(),
      description: form.querySelector('input#message').value.trim()
    }

    console.log(JSON.stringify(data))
    sendFormData(data)
    // Add validation checking
  }

  function validator (e) {
    submit.disabled = true
      // CHANGE THIS TO CHECK FIELD VALIDITY
      // https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

    if (nameField.validity.valid && emailField.validity.valid && messageField.validity.valid) {
      submit.disabled = false
    }
  }

  form.addEventListener('change', validator)
  submit.addEventListener('click', getFormData)
}

export default contactForm
