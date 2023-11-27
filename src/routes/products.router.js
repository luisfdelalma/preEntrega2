const { Router } = require("express")
const { productModel } = require("../models/product.model")

const router = Router()

router.get("/search", async (req, res) => {
    let limit = parseInt(req.query.limit)
    let page = parseInt(req.query.page)
    let sort = req.query.sort
    let category = req.query.category
    let status = req.query.status

    if (!limit || limit === 0) { limit = 10 }
    if (!page || page === 0) { page = 1 }
    if (sort == "ASC" || sort == "asc") { sort = 1 }
    if (sort == "DESC" || sort == "desc") { sort = -1 }
    if (!status) { status = [true, false] }
    if (!category) { category = ["Category A", "Category B", "Category C"] }
    if (!sort) {
        try {
            let result = await productModel.paginate({ category: category, status: status }, { page: page, limit: limit }, function (err, res) {
                if (err) {
                    console.error(err)
                } else {
                    return {
                        docs: res.docs,
                        totalPages: res.totalPages,
                        prevPage: res.prevPage,
                        nextPage: res.nextPage,
                        page: res.page,
                        hasPrevPage: res.hasPrevPage,
                        hasNextPage: res.hasNextPage,
                        prevLink: res.hasPrevPage ? `?page=${page - 1}` : null,
                        nextLink: res.hasNextPage ? `?page=${page + 1}` : null
                    }
                }
            })
            let rendProd = result.docs.map(item => item.toObject())
            console.log(result);
            let nextUrl = `/api/products${(req.url.replace(`page=${result.page}`, `page=${result.page + 1}`))}`
            let prevUrl = `/api/products${(req.url.replace(`page=${result.page}`, `page=${result.page - 1}`))}`
            console.log(prevUrl, nextUrl)

            res.render("products", { products: rendProd, hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage, prevLink: prevUrl, nextLink: nextUrl })


        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            let result = await productModel.paginate({ category: category, status: status }, { page: page, limit: limit, sort: { price: sort } }, function (err, res) {
                if (err) {
                    console.error(err)
                } else {
                    return {
                        docs: res.docs,
                        totalPages: res.totalPages,
                        prevPage: res.prevPage,
                        nextPage: res.nextPage,
                        page: res.page,
                        hasPrevPage: res.hasPrevPage,
                        hasNextPage: res.hasNextPage,
                        prevLink: res.hasPrevPage ? `?page=${page - 1}` : null,
                        nextLink: res.hasNextPage ? `?page=${page + 1}` : null
                    }
                }
            })
            let rendProd = result.docs.map(item => item.toObject())
            console.log(result);
            let nextUrl = `/api/products${(req.url.replace(`page=${result.page}`, `page=${result.page + 1}`))}`
            let prevUrl = `/api/products${(req.url.replace(`page=${result.page}`, `page=${result.page - 1}`))}`
            console.log(prevUrl, nextUrl)

            res.render("products", { products: rendProd, hasNextPage: result.hasNextPage, hasPrevPage: result.hasPrevPage, prevLink: prevUrl, nextLink: nextUrl })
        } catch (error) {
            console.log(error);
        }
    }

})

router.get("/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    let result = await productModel.paginate({ BId: id }, {}, function (err, res) {
        if (err) {
            console.error(err)
        } else {
            return {
                docs: res.docs,
                totalPages: res.totalPages,
                prevPage: res.prevPage,
                nextPAge: res.nextPage,
                page: res.page,
                hasPrevPage: res.hasPrevPage,
                hasNextPage: res.hasNextPage,
                prevLink: res.hasPrevPage ? `/api/products/search?page=${page - 1}` : null,
                nextLink: res.hasNextPage ? `/api/products/search?page=${page + 1}` : null
            }
        }
    })

    res.send({ result: "success", payload: result })
})

router.post("/", async (req, res) => {
    let { title, BId, description, code, price, status, stock, category, thumbnail } = req.body

    if (!title || !BId || !description || !code || !price || !status || !stock || !category || !thumbnail) {
        res.send({ status: "error", error: "Faltan parametros" })
    }

    let result = await productModel.create({ title, BId, description, code, price, status, stock, category, thumbnail })
    res.send({ status: "success", payload: result })
})

router.put("/:BId", async (req, res) => {
    let BId = req.params.BId
    let productToModify = req.body

    if (!productToModify.title || !productToModify.description || !productToModify.code || !productToModify.price || !productToModify.status || !productToModify.stock || !productToModify.category || !productToModify.thumbnail) {
        res.send({ status: "error", error: "Faltan parametros" })
    }

    let result = await productModel.updateOne({ BId: BId }, productToModify)
    res.send({ result: "success", payload: result })
})

router.delete("/:BId", async (req, res) => {
    let BId = req.params.BId

    let result = await productModel.deleteOne({ BId: BId })
    res.send({ result: "success", payload: result })
})


module.exports = router