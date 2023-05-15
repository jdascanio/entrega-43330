import { Router } from "express";
import ProductManager from "../modules/productManager.js";
import { products } from "../utils.js";
import { socketServer } from "../app.js";
const pm = new ProductManager('./products.json')

const productRouter = Router();

productRouter.get('/', async (req, res) => {
    try {
        let productos = await pm.getProducts()
        let limit = req.query.limit
        if (!limit || parseInt(limit) >= productos.length) {
            res.send(productos)
        } else if (parseInt(limit) <= 0) {
            res.send('<h4 style="color: red; text-transform: uppercase"> el limite de productos no puede ser igual o menor a cero</h4>')
        } else if (isNaN(+limit)) {
            res.send(`Seleccione un número entre 0 y ${productos.length} para limitar la cantidad de productos mostrados`)
        } else {
            let newProductList = productos.splice(0, limit)
            res.send(newProductList)
        }
    }
    catch (err) {
        res.send(err)
    }
})

productRouter.get("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid
        let producto = await pm.getProductById(parseInt(pid))
        if (producto === false) {
            res.status(400).send({ error: 'ID no encontrado' })
        } else {
            res.send(producto)
        }

    } catch (err) {
        res.send(err)
    }
})

productRouter.post("/", async (req, res) => {
    try {
        let value = await pm.addProduct(req.body)
        if (value === false) {
            res.status(400).send({ status: 400, error: 'Campos incompletos o incorrectos' })
        } else if (value === 'code repeated') {
            res.status(400).send({ status: 400, error: 'El campo code ya se encuentra cargado para otro producto' })
        }   
        else {
            socketServer.emit('update', await pm.getProducts())
            res.status(201).send(value)
        }

    } catch (err) {
        res.send(err)
    }
})

productRouter.put("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid
        let productEdit = await pm.updateProduct(pid, req.body)
        if (!productEdit) {
            res.status(400).send({ error: 'Uno o más campos no son válidos' })
        } else if (productEdit === 400) {
            res.status(400).send({ error: 'el campo ID no puede ser modificado' })
        } else if (productEdit === 404) {
            res.status(404).send({ error: 'El id indicado no corresponde a un producto valido' })
        }
        else{
            socketServer.emit('update', await pm.getProducts())
            res.send(productEdit)
        }
    }
    catch (err) {
        res.send(err)
    }
})

productRouter.delete("/:pid", async (req, res) => {
    try {
        let pid = req.params.pid
        let productDelete = await pm.deleteProduct(pid)
        if (!productDelete) {
            res.status(404).send({ error: 'El id indicado no corresponde a un producto valido' })
        }        
        else{
            socketServer.emit('update', await pm.getProducts())
            res.send(`se borró producto con id: ${pid}`)
        }
    }
    catch (err) {
        res.send(err)
    }
})

export { productRouter }

