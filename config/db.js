// install mongoose --- npm install --save mongoose

//ODM -object data model

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true) // to remove depreciation warning, not requried otherwise.

mongoose.connect('mongodb://localhost:27017/sept-ecommerce', { useNewUrlParser: true }).then(function () {
    console.log('connected to DB ');
}).catch(function (err) {
    console.log('error connecting to DB  ', err);
});

module.exports = {
    mongoose
}
// can also put mongoose:mongoose above -- concise object properties