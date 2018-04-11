'use strict'
// require npm packages for mysql
var mysql = require('mysql')
// require npm packages for inquirer
var inq = require('inquirer')
// make a prompt for inquirer
var pmpt = inq.createPromptModule()
// inquirer questions
var qs = [
  {
    type: 'input',
    name: 'productId',
    message: 'What is the ID of the item you are looking to purchase?'
  },
  {
    type: 'input',
    name: 'units',
    message: 'How many units would you like to buy?'
  }
]
// connection credentials for mySQL
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '04Powep20',
  database: 'items_db'
})

var orderArr = []
var itemsArr = []

// this is a constructor to turn the order into an object
function Order (productId, units) {
  this.productId = productId
  this.units = units
}

connection.connect(function (e) {
  if (e) throw e
  connection.query('SELECT * FROM items', function (e, r) {
    if (e) throw e
    for (var i = 0; i < r.length; i++) { // this loop makes the data more readable for the user by adding it to a JSON obj
      itemsArr.push({
        id: r[i].item_id,
        product: r[i].product_name,
        price: r[i].price,
        inventory: r[i].instock
      })
    }
    console.log(itemsArr)
    pmpt(qs).then(function (r) {
      var order = new Order(r.productId, r.units)
      orderArr.push(order)
      orderCalc()
      updateData()
    })
  })
})

// this will calculate the price of the order
function orderCalc () {
  var command = `
SELECT * FROM ITEMS
WHERE item_id = '${orderArr[0].productId}' ;
`
  connection.query(command, function (e, r) {
    var price = (orderArr[0].units * r[0].price)
    if (e) throw e
    console.log('Your Cost For this order is: $' + price)
    console.log('with a 25% markup you will make: $' + (parseFloat(price * 0.25)) + ' in profit!')
  })
}

// this will update the database to reflect inventory change
function updateData () {
  var units = parseInt(orderArr[0].units)
  var inventory = itemsArr[orderArr[0].productId - 1].inventory
  var result = inventory - units
  var cmd = `
  UPDATE ITEMS
  SET instock = ${result}
  WHERE item_id = '${orderArr[0].productId}'
  `
  if (result > 0) {
    connection.query(cmd, function (e, res) {
      if (e) throw e
      console.log('order was placed successfully')
    })
  }
  else {
    console.log("there wasn't enough inventory to fill your order")
  }
}
