const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const path = require("path")


const app = express()
const PORT = 8080

// Handle bars config
app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use(express.json())

const environment = async () => {
    await mongoose.connect("mongodb+srv://luisfdlta:Mejorsolo1095@cluster0.aauduvj.mongodb.net/?retryWrites=true&w=majority")
}
environment()

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)