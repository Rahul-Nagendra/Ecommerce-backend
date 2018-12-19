const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator'); //npm install --save bcryptjs
const bcrypt = require('bcryptjs'); // bcrypt is used to store encrypted passwords
const jwt = require('jsonwebtoken'); // npm install --save jsonwebtoken
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        //validate the format - custom validation to be done
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'invalid email ID'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    mobile: {
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 10,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isNumeric(value)
            },
            message: function () {
                return 'invalid mobile number'
            }
        }
    },
    tokens: [{
        token: {
            type: String
        }
    }]
});

//passwod encryption before saving to DB
userSchema.pre('save', function (next) {
    let user = this; // to get access to current object
    if (user.isNew) {
        bcrypt.genSalt(10).then(function (salt) {
            bcrypt.hash(user.password, salt).then(function (encrypted) {
                user.password = encrypted;
                next()
            });
        });
    } else {
        next();
    }
});

//to define ouw own static methods which is invoked on the type User.
userSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({ email: email }).then(function (user) {
        // console.log(password, user.password)
        if (!user) {
            return Promise.reject('invalid email or password')
        }
        return bcrypt.compare(password, user.password).then(function (res) {

            if (res) {
                return Promise.resolve(user)
            } else {
                return Promise.reject('invalid email or password')
            }
        });
    });
}

//to define our own instance methods , i.e which is invoked on an object
userSchema.methods.generateToken = function () {
    let user = this;
    let tokenData = {
        userId: this._id
    }
    let jwtToken = jwt.sign(tokenData, 'ozymandias')
    user.tokens.push({ token: jwtToken })

    return user.save().then(function (user) {
        return jwtToken
    })
}

userSchema.statics.findByToken = function (token) {
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'ozymandias');

    } catch (err) {
        return Promise.reject(err.message);
    }

    return User.findOne({
        '_id': tokenData.userId,
        'tokens.token': token
    })
}

const User = mongoose.model('User', userSchema);

module.exports = {
    User
}