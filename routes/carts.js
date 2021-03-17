const express = require("express");
const { createCart, addToCart, getCart, deleteItem } = require("../repositories/cart");
const { getOne } = require("../repositories/product");
const cartTemplate = require("../views/carts/show");

const router = express.Router();

router.post("/cart/products/:id/add", async (req, res) => {
  const productId = parseInt(req.params.id);
  if (!req.session.cartId) {
    const cartId = await createCart(productId);
    req.session.cartId = cartId;    
  } else {
    const cartId = parseInt(req.session.cartId);
    await addToCart(cartId, productId);
  }
  res.redirect("/");
});

router.get("/cart", async (req, res) => {
    if (!req.session.cartId) {
        res.redirect("/");
    } else {
        const cart = await getCart(parseInt(req.session.cartId));
        for(let item of cart.items) {
            const product = await getOne(item.id);
            item.product = product;
        }

        res.send(cartTemplate(cart.items));
    }
});

router.post("/cart/products/:id/delete", async (req, res) => {
    const cartId = parseInt(req.session.cartId);
    const productId = parseInt(req.params.id);
    await deleteItem(cartId, productId);

    res.redirect("/cart");
});

module.exports = router;
