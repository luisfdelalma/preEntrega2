const { Router } = require("express")
const { cartsModel } = require("../models/cart.model.js")
const { productModel } = require("../models/product.model.js")

const router = Router()

router.post("/", async (req, res) => {
    let { CId, products } = req.body
    if (!CId) {
        res.send({ status: "Error", error: "Falta el ID del carrito" })
    }
    let result = await cartsModel.create({ CId, products })
    res.send({ result: "success", payload: result })
})

router.delete("/:cid", async (req, res) => {
    let CId = req.params.cid

    let result = await cartsModel.findByIdAndUpdate(CId, { products: [] })
    res.send({ result: "success", payload: result })
})

router.delete("/:cid/products/:pid", async (req, res) => {
    let cart = await cartsModel.findById(req.params.cid, (err, foundCart) => {
        if (err) {
            console.error("Error: ", err);
        } else if (!foundCart) {
            console.log("El carrito indicado no ha sido encontrado");
            res.send({ result: "failure", payload: "El carrito indicado no ha sido encontrado" })
        } else {
            let productId = req.params.pid
            let productIndex = foundCart.products.findIndex((productItem) => productItem.product == productId)

            if (productIndex !== 1) {
                foundCart.products.splice(productIndex, 1)
                foundCart.save((err, updatedCart) => {
                    if (err) {
                        console.error("Error: ", err)
                    } else {
                        console.log("Producto eliminado del carrito", updatedCart)
                    }
                })
            } else {
                console.log("El producto no fue encontrado en el carrito")
            }
        }
    })

})

router.put("/:cid", async (req, res) => {
    let cart = await cartsModel.findById(req.params.cid)
    let existingProducts = cart.products
    let exProdSet = new Set(existingProducts.map(prod => prod.product.toString()))
    let newProducts = req.body

    if (existingProducts.length !== 0) {
        for (const newProd of newProducts) {
            if (exProdSet.has(newProd.product)) {
                console.log("true");
                let i = existingProducts.findIndex((el) => el.product == newProd.product)
                existingProducts[i].quantity += newProd.quantity
            } else {
                existingProducts.push(newProd)
                exProdSet.add(newProd.product)
                console.log("false");
            }
        }
    } else {
        for (const newProd of newProducts) {
            existingProducts.push(newProd)
        }
    }

    let result = await cartsModel.updateOne({ _id: req.params.cid }, { products: existingProducts })
    res.send({ status: "success", payload: result })
})

router.put("/:cid/products/:pid", async (req, res) => {
    let prodId = req.params.pid
    let newQuantity = req.body.quantity
    let cart = await cartsModel.findById(req.params.cid)
    let products = cart.products
    let prodSet = new Set(products.map(prod => prod.product.toString()))

    if (prodSet.has(prodId)) {
        let i = products.findIndex(el => el.product == prodId)
        products[i].quantity = newQuantity

        let result = await cartsModel.updateOne({ _id: req.params.cid }, { products: products })
        res.send({ status: "success", payload: result })
    } else {
        res.send("El producto ingresado no se encuentra en el carrito seleccionado")
    }

})

router.get("/:cid", async (req, res) => {
    let cart = await cartsModel.find({ _id: req.params.cid })
    res.send(cart)
})

module.exports = router