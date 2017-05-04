const url = 'https://m5pun1fvqc.execute-api.us-east-1.amazonaws.com/testing/contact'

function contactForm () {
  console.log("Contact Form Loaded")

  const form = document.querySelector('form.contact-form')
  const submit = form.querySelector('button')

  let nameField = form.querySelector('input#name')
  let emailField = form.querySelector('input#email')
  let messageField = form.querySelector('input#message')
  let botField = form.querySelector('input#bot-field')

  function clearForm() {
    nameField.value = ''
    emailField.value = ''
    messageField.value = ''
  }

  function sendFormData (data) {
    const payload = JSON.stringify(data)
    const request = new XMLHttpRequest()
    request.open('POST', url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    request.send(payload)
    // Add response handling and pass error to user
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
      name: form.querySelector('input#name').value,
      email: form.querySelector('input#email').value,
      description: form.querySelector('input#message').value
    }

    console.log(JSON.stringify(data))
    sendFormData(data)
    // Add validation checking
    clearForm()
  }

  submit.addEventListener('click', getFormData)
}

export default contactForm



// Set submit event handler on button

// Get values of form

// Validate to make sure they're good

// Assemble JSON

// var request = new XMLHttpRequest();
// request.open('POST', '/my/url', true);
// request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
// request.send(data);
