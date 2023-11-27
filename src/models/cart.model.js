const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const cartsCollection = "carts"
const cartsSchema = mongoose.Schema({
    CId: { type: Number, index: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: Number
        }
    ]

})

cartsSchema.pre("find", function () {
    this.populate("products.product")
})

cartsSchema.plugin(mongoosePaginate)

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

module.exports = { cartsModel }