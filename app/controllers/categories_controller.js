const express = require('express');
const router = express.Router();
// npm install --save mongod
const { ObjectID } = require('mongodb'); // installed package, we're using a property called as ObjectID
const { Category } = require('../models/category');

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
//localhost:3000/categories/
router.get('/', function (req, res) {
    // res.send('list of categories');
    Category.find().then(function (categories) {
        res.send(categories);
    }).catch(function (err) {
        res.send(err);
    })
});

//localhost:3000/categories/id
router.get('/:id', validateId, function (req, res) {
    let id = req.params.id;
    //id=123 or invalid id
    // if(!ObjectID.isValid(id)){
    //     res.send({notice: 'invalid object id'});
    // }// checking if the id is a valid obejct id.
    Category.findById(id).then(function (category) {
        res.send(category);
    }).catch(function (err) {
        res.send(err);
    });
});

//post localhost:3000/categories
router.post('/', function (req, res) {
    let body = req.body;
    let c = new Category(body);
    c.save().then(function (category) {
        res.send(category);
    }).catch(function (err) {
        res.send(err);
    });
});

//PUT localhost:3000/categories/id
router.put('/:id', validateId, function (req, res) {
    let body = req.body;
    let id = req.params.id;
    Category.findByIdAndUpdate(id, { $set: body }, { new: true }).then(function (category) {
        res.send(category);
    }).catch(function (err) {
        res.send(err);
    });
});

//delete localhost:3000/categories/id
router.delete('/:id', validateId, function (req, res) {
    let id = req.params.id;
    Category.findByIdAndDelete(id).then(function () {
        res.send({ notice: "Deleted the document successfully" });
    }).catch(function (err) {
        res.send({ notice: 'Record with specified ID not found' });
    });
});


module.exports = {
    categoriesController: router
}