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
    type: 'list',
    name: 'input',
    message: 'What do you want to do?',
    choices: [
      'View Products For Sale',
      'View Low Inventory',
      'Add To Inventory',
      'Add New Product'
    ]
  }
]

var add = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name of the product you want to add?'
  },
  {
    type: 'input',
    name: 'department',
    message: 'What department?'
  },
  {
    type: 'input',
    name: 'price',
    message: 'What is the price?'
  },
  {
    type: 'input',
    name: 'num',
    message: 'How many would you like to add?'
  }
]

var itemsArr = []

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '04Powep20',
  database: 'items_db'
})

pmpt(qs).then(function (r) {
  switch (r.input) {
    case 'View Products For Sale':
      viewProducts()
      break
    case 'View Low Inventory' :
      lowInv()
      break
    case 'Add To Inventory' :
      addInv()
      break
    case 'Add New Product' :
      addProd()
      break
  }
})

// function to view the products
function viewProducts () {
  connection.connect(function (e) {
    if (e) throw e
    connection.query('SELECT * FROM items', function (e, r) {
      if (e) throw e
      for (var i = 0; i < r.length; i++) { // this loop makes the data more readable for the user by adding it to a JSON obj
        itemsArr.push({
          id: r[i].item_id,
          product: r[i].product_name,
          price: r[i].price
        })
      }
      console.log(itemsArr)
    })
    connection.end(function (e) {
      if (e) throw e
    })
  })
}

// function to view the low inventory items
function lowInv () {
  connection.connect(function (e) {
    if (e) throw e
    var str = `
    SELECT * FROM items
    WHERE instock < 100
    `
    connection.query(str, function (e, r) {
      if (e) throw e
      for (var i = 0; i < r.length; i++) { // this loop makes the data more readable for the user by adding it to a JSON obj
        itemsArr.push({
          id: r[i].item_id,
          product: r[i].product_name,
          inStock: r[i].instock
        })
      }
      console.log(itemsArr)
    })
    connection.end(function (e) {
      if (e) throw e
    })
  })
}

// function to add inventory
function addInv () {
  console.log('you added inventory')// I didn't finish this one
}

// function to add product
function addProd () {
  pmpt(add).then(function (r) {
    var newProduct = `
    INSERT INTO items(product_name, department, price, instock)
    VALUES ('${r.name}','${r.department}',${r.price},${r.num})
    `
    connection.connect(function (e) {
      if (e) throw e
      connection.query(newProduct, function (e, r) {
        if (e) throw e
        console.log(r)
      })
    })
  })
}
