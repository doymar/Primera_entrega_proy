import { Router } from "express";
import { CartsManager } from "../CartManager.js"; 

const router = Router();

router.post("/",async(req,res)=>{
    try{
        const response = await CartsManager.createCart();
        res.status(200).json({ message: "Cart created", cart: response });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.get('/:cid',async(req,res)=>{
    console.log(req.params);
    const {cid} = req.params
    try{
        const cart = await CartsManager.getCartById(+cid);
        console.log(cart);
        if(!cart){
            return res.status(404).json({message: "The cart does not exist"});
        }
        res.status(200).json({message:'Cart found',cart});
    }catch(error) {
        res.status(500).json({message: error.message});
    }
});

router.post('/:cid/product/:pid',async(req,res)=>{
    console.log(req.params);
    const {cid,pid} =req.params
    try{
        const cart = await CartsManager.addProductToCart(+pid,+cid)
        if(!cart){
            return res.status(404).json({message: "Some data is wrong"});
        }
        res.status(200).json({message:'Product added',cart});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});


export default router