import { existsSync, promises } from 'fs'
import { ProductsManager } from './ProductManager.js'
import { Console } from 'console';

class CartManager {

    constructor(){
        this.path = 'Carts.json'
    }

    async getCarts(){
        try{
            if(existsSync(this.path)){
                const cartsFile = await promises.readFile(this.path,'utf-8');
                const cartData = JSON.parse(cartsFile);
                return cartData;
            }else {
                return [];
            }
        } catch (error){
            return error
        }
    }

    async createCart(){
        try{
            const carts = await this.getCarts()
            let id
            if (!carts.length) {
                id = 1
            } else {
                id = carts[carts.length - 1].id + 1
            }

            const newCart = { id, products: []}

            carts.push(newCart)
            await promises.writeFile(this.path,JSON.stringify(carts))
            console.log('Product added')
            return newCart;
        } catch(error){
            return error;
        }
    }

    async getCartById(idCart) {
        try{
            const carts = await this.getCarts()
            const cart = carts.find((c) => c.id === idCart)
            if(!cart){
                return [];
            }
            return cart
        }catch(error){
            return error
        }
    }


    async addProductToCart(pid,cid){
        try{
            if (existsSync(this.path)){
                const cartProductsFile= await promises.readFile(this.path, 'utf-8')
                
                const cartProductsParseado= JSON.parse(cartProductsFile)
                const selectedCart = cartProductsParseado.find(c=> c.id === cid)
    
                if (selectedCart){
                    const product = await ProductsManager.getProductById(pid);
                    if (!product) {
                      throw new Error("There is no product with this id");
                    }
    
                    const prodExists = selectedCart.products.find(p=>p.pid === pid)
                    if (prodExists) {
                        const index = selectedCart.products.findIndex(p=> p.pid == pid)
                        selectedCart.products[index].quantity++                    
                    }else{
                        const newProd ={pid, quantity: 1}
                        selectedCart.products.push(newProd)
                    }
                    
                    await promises.writeFile(this.path, JSON.stringify(cartProductsParseado))
                }            
                return selectedCart            
            }else{
                throw new Error("The file does not exist");
            }
        }catch(error){
            return error
        }
    }
}

export const CartsManager = new CartManager();