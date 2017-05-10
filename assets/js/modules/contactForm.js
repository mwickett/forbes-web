const url = 'https://m5pun1fvqc.execute-api.us-east-1.amazonaws.com/testing/contact'

function contactForm () {
  const form = document.querySelector('form.contact-form')
  const submit = form.querySelector('button')

  let nameField = form.querySelector('input#name')
  let emailField = form.querySelector('input#email')
  let messageField = form.querySelector('input#message')
  let botField = form.querySelector('input#bot-field')
  let feedBackMessage = form.querySelector('span.formStatus')

  function clearForm () {
    nameField.value = ''
    emailField.value = ''
    messageField.value = ''
  }

  function displayMessage (message, status) {
    if (message === 'clear') {
      feedBackMessage.innerHTML = " "
      feedBackMessage.classList.remove('error')
      feedBackMessage.classList.remove('success')
    } else {
      feedBackMessage.classList.add(status)
      feedBackMessage.innerHTML = message
    }
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
            displayMessage("It's been sent! We'll be in touch soon", 'success')
            clearForm()
          } else {
            displayMessage('Something went wrong. Please try again', 'error')
            console.log('Something went wrong with the server')
          }
          break
      }
    }
  }

  function getFormData (e) {

    // Check if bot field has a value, if it does, don't send.
    if (botField.value) {
      clearForm()
      displayMessage('Bot-field filled - submission rejected as spam', 'error')
      console.log("Bot-field filled - submission rejected")
      return
    }

    const data = {
      name: form.querySelector('input#name').value.trim(),
      email: form.querySelector('input#email').value.trim(),
      description: form.querySelector('input#message').value.trim()
    }
    sendFormData(data)
  }

  function validate (e) {
    const target = e.target
    // Check if it's our button
    if (target.name === 'submit') {
      e.preventDefault()
      if (nameField.validity.valid && emailField.validity.valid) {
        getFormData()
      } else if (!nameField.validity.valid && !emailField.validity.valid) {
        displayMessage('The name and email fields are required', 'error')
        nameField.classList.add('error')
        emailField.classList.add('error')
      } else if (!nameField.validity.valid) {
        displayMessage('The name field is required', 'error')
        nameField.classList.add('error')
      } else if (!emailField.validity.valid) {
        displayMessage("The email field is required in the format 'name@email.com'", 'error')
        emailField.classList.add('error')
      }
    } else {
      if (target.validity.valid) {
        displayMessage('clear')
        target.classList.remove('error')
      }
    }
  }

  nameField.addEventListener('keyup', validate)
  emailField.addEventListener('keyup', validate)
  messageField.addEventListener('keyup', validate)
  submit.addEventListener('click', validate)
}

export default contactForm
