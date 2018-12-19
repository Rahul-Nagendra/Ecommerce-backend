const express = require('express');
const app = express();
const port = 3000;

const { mongoose } = require('./config/db.js');

const { categoriesController } = require('./app/controllers/categories_controller');

const { productsController } = require('./app/controllers/products_controller');

const { userController } = require('./app/controllers/users_controller');

app.use(express.json());

app.get('/', function (req, res) {
    res.send('welcome to the site!');
})

//get categories
app.use('/categories', categoriesController);

//get products
app.use('/products', productsController);

// /users
app.use('/users', userController);

app.listen(port, function () {
    console.log('listening on port ', port);
});