const express = require("express");
const { listAll } = require("../repositories/product");
const productsIndexTemplate = require("../views/products/index");

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await listAll();
    res.send(productsIndexTemplate(products));
});


module.exports = router;