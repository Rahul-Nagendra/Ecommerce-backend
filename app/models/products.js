const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//name , price, description, category, codEligible, stock
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true
    },
    codEligible: {
        type: Boolean,
        required: true,
        default: true,
        validate: {
            validator: function (value) {
                // console.log(value);
                return !(this.price >= 25000 && value)
                // can use value or this.codEligible
            },
            message: function () {
                return 'COD option is not available for product price more than 25k'
            }
        }

    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = {
    Product
}