import fs from 'fs'


export default class CartManager {
    #idCart = 1
    constructor(path) {
        this.path = path
        // if (!this.path){
        //     fs.writeFileSync(this.path, JSON.stringify([]))
        // }
        this.carts = []
    }

    async addCart() {
        let carts = await this.getAllCarts()
        const cart = {}
        cart.products = []
        cart.id = await this.#getId()
        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
    }

    async addProduct(idCart, body) {
        const cartList = await this.getAllCarts()
        const cart = cartList.findIndex((item) => item.id == idCart)
        
        let products = JSON.parse(await fs.promises.readFile('./products.json', 'utf-8'))
        let productIsIncluded = products.findIndex((item) => item.id === body.product)
        if (productIsIncluded === -1) {
            return 404 //el producto no existe
        }
        
        if (cart >= 0) {
            let arrayProducts = cartList[cart].products
            let productIndex = arrayProducts.findIndex((item) => item.product === body.product)
            if (productIndex !== -1) {
                arrayProducts[productIndex].quantity = arrayProducts[productIndex].quantity + body.quantity
                await fs.promises.writeFile(this.path, JSON.stringify(cartList));

                return (`se agregaron ${body.quantity} unidad/es al producto con id: ${body.product}`)
            } else {
                arrayProducts.push(body)
                await fs.promises.writeFile(this.path, JSON.stringify(cartList));
                return (`Se agregaron ${body.quantity} unidad/es del producto con id: ${body.product} al carrito con id:${idCart}`)
            }
        }else{
            return false
        }
    }

    async deleteProduct(idCart, idProduct){
        const cartList = await this.getAllCarts()
        const cart = cartList.findIndex((item) => item.id == idCart)
        if (cart !== -1){
            const productIndex = cartList[cart].products.findIndex((item) => item.product == idProduct)
            console.log(productIndex)
            if (productIndex !== -1){
                cartList[cart].products.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(cartList));
                return (`product con id: ${idProduct} eliminado del carrito con id: ${idCart}`, cartList)
            }
            else{
                return (404)
            }
        }else{
            return (404)
        }
    }

    async getAllCarts() {
        let carts = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(carts)
    }

    async getCart() {
        let productos = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(productos)
    }


    async getCartById(idCart) {
        const cartList = await this.getAllCarts()
        const cart = cartList.findIndex((item) => item.id == idCart)
        if (cart >= 0) {
            return cartList[cart].products
        }else{
            return false
        }
    }


    async #getId() {
        const cartList = await this.getAllCarts()
        let idValues = cartList.length > 0 ? cartList.map((items) => items.id) : 1
        const newID = idValues === 1 ? 1 : Math.max(...idValues) + 1

        return newID;
    }



}
// const cm = new CartManager('../../cart.json');
// async function prueba() {
//    await  cm.addCart()
//    await  cm.addCart()
//    await  cm.addCart()
//    await  cm.addCart()
// }


// prueba()
//updateProduct: El parametro "campos" puede ser un objeto con multiples pares key:value o bien un string
// async function tests() {
//     await pm.getProducts()
//     await pm.addProduct('remera', 'remera de algodon blanca', 1500, 'sin imagen', 12870001, 20)
//     await pm.addProduct('Patalon', 'Pantalon de Jean', 3500, 'sin imagen', 12870002, 10)
//     await pm.addProduct('Zapatos', 'Zapatos negros', 4500, 'sin imagen', 12870004, 10)
//     await pm.getProducts()
//     await pm.updateProduct(1, { 'title': 'camisa', 'price': 2000, 'id': 5 }, 5000)
//     await pm.getProducts()
//     await pm.updateProduct(1, { 'nombre': 'tela', 'price': 2000, 'id': 5 }, 5000)
//     await pm.getProducts()
//     await pm.updateProduct(1, 'description', 'Camisa color blanco')
//     await pm.deleteProduct(3)
//     await pm.deleteProduct(3)
//     await pm.getProducts()
//     await pm.getProductById(1)
//     await pm.getProductById(5)

// }
// tests()