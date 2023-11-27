const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productsCollection = "products"
const productsSchema = mongoose.Schema({
    title: { type: String, index: true },
    BId: Number,
    description: String,
    code: String,
    price: Number,
    status: { type: Boolean, default: true },
    stock: Number,
    category: String,
    thumbnail: String
})

productsSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productsCollection, productsSchema)

module.exports = { productModel }