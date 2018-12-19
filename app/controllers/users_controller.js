const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');

/*
// ******************** OLD CODE *****************
router.post('/', function (req, res) {
    let body = req.body;
    let newUser = new User(body);
    newUser.save().then(function (user) {
        res.send({
            user,
            notice: 'successfully added to DB'
        })
    }).catch(function (err) {
        res.send(err);
    });
}); //old code
*/

//updated code with token
router.post('/', function (req, res) {
    let body = req.body;
    let newUser = new User(body);
    newUser.save().then((function (user) {
        return user.generateToken()
    }))
        .then(function (token) {
            res.header('x-auth', token).send()
        }).catch(function (err) {
            res.send(err)
        })
});

router.get('/', function (req, res) {
    User.find().then(function (user) {
        res.send(user);
    }).catch(function (err) {
        res.send(err);
    });
});

router.post('/login', function (req, res) {
    let body = req.body;
    User.findByCredentials(body.email, body.password)
        .then(function (user) {
            return user.generateToken()
        }).then(function (token) {
            res.header('x-auth', token).send()
        })
        .catch(function (err) {
            res.status(401).send(err)
        })
});

router.get('/profile', authenticateUser, function (req, res) {
    let user = req.user;
    res.send({
        username: user.username,
        email: user.email,
        mobile: user.mobile
    })
});

router.delete('/logout', authenticateUser, function (req, res) {
    const { user, token } = req;
    const tokenInfo = user.tokens.find(function (tokenItem) {
        return tokenItem.token == token
    })
    // user.tokens.remove(tokenInfo._id) -- same as below
    user.tokens.id(tokenInfo._id).remove(); // id is a method to remove a subdocument of a document... parent.child.id(childID).remove()
    user.save().then((user) => {
        res.send({
            notice: 'logged out successfully!'
        })
    })
})

module.exports = {
    userController: router
}