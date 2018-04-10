// require node packages for inquirer
var inq = require('inquirer')
// prompt
var pmpt = inq.createPromptModule()
// questions
var qs = {
  type: 'list',
  name: 'userType',
  message: 'What type of user are you?',
  choices: [
    'user',
    'manager',
    'supervisor'
  ]
}

// ask question the run the code based upon the user's response
pmpt(qs).then(function (r) {
  console.log(r.userType)
  switch (r.userType) {
    case 'user':
      console.log('Here is a list of the items you can buy:')
      require('./customer.js')
      break
    case 'manager':
      console.log('youre a manager')
      require('./manager.js')
      break
    case 'supervisor':
      console.log('youre a supervisor')
      require('./supervisor.js')
      break
  }
})
