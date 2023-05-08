import { Router } from "express";
import CartManager from "../modules/cartManager.js";

const cm = new CartManager('./cart.json')

const cartRouter = Router();

cartRouter.post('/', async (req, res) => {
    try {

        res.status(201).send(await cm.addCart())
    }
    catch (err) {
        res.send(err)
    }
})

cartRouter.get('/:cid', async (req, res) => {
    try {
        let cid = req.params.cid
        let cart = await cm.getCartById(cid)
        if (!cart) {
            res.status(404).send({ error: `no existe carrito con id: ${cid}` })
        } else {
            res.send(cart)
        }
    } catch (err) {
        res.send(err)
    }
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let cuerpo = { "product": parseInt(pid), "quantity": req.body.quantity }

        let addedProduct = await cm.addProduct(parseInt(cid), cuerpo)
        if (addedProduct === 404) {
            res.status(404).send({ error: "El producto no existe" })
        } else if (!addedProduct) {
            res.status(404).send({ error: "Carrito inexistente" })
        } else {
            res.send(addedProduct)
        }
    }
    catch (err) {
        res.send(err)
    }
})
cartRouter.delete('/:cid/product/:pid', async (req, res) => {

    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let deleteProduct = await cm.deleteProduct(parseInt(cid), parseInt(pid))
        if (deleteProduct === 404) {
            res.status(404).send({ error: "id de carrito inexistente o id de producto no existe en el carrito" })
        } else {
            res.send(deleteProduct)
        }
    } catch (err) {
        res.send(err)
    }

})


export { cartRouter }