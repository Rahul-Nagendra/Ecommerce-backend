const express = require('express');
const router = express.Router();
const { Product } = require('../models/products');

const validateId = (req, res, next) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.send({
            notice: 'invalid object id'
        });

    } else {
        next();
    }
}

//localhost:3000/products
router.get('/', function (req, res) {
    Product.find().then(function (products) {
        res.send(products);
    }).catch(function (err) {
        res.send(err);
    });
});

// get localhost:3000/products/:id
router.get('/:id', function (req, res) {
    let id = req.params.id;
    Product.findById(id).then(function (product) {
        res.send(product);
    }).catch(function (err) {
        res.send(err);
    });
})

//POST localhost:3000/products
router.post('/', function (req, res) {
    let body = req.body;
    let prod = new Product(body);
    prod.save().then(function (product) {
        res.send(product);
    }).catch(function (err) {
        res.send(err);
    });
});

//DELETE localhost:3000/products/idF
router.delete('/:id', function (req, res) {
    let id = req.params.id;
    Product.findByIdAndDelete(id).then(function () {
        res.send({ notice: 'Deleted Successfully' });
    }).catch(function (err) {
        res.send(err);
    });
});

//PUT localhost:3000/products/id
router.put('/:id', validateId, function (req, res) {
    let body = req.body;
    let id = req.params.id;
    Product.findByIdAndUpdate(id, { $set: body }, { new: true }).then(function (product) {
        res.send(product);
    }).catch(function (err) {
        res.send(err);
    });
});


module.exports = {
    productsController: router
}