const express = require("express");
const multer = require("multer");

const {
  addProduct,
  editProduct,
  deleteProduct,
  listAll,
  getOne,
} = require("../../repositories/product");
const newProductTemplate = require("../../views/admin/products/new");
const productsIndexTemplate = require("../../views/admin/products/index");
const editProductTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");
const { handleErrors, ensureAuthorized } = require("./middlewares");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", ensureAuthorized, async (req, res) => {
  const products = await listAll();
  res.send(productsIndexTemplate(products));
});

router.get("/admin/products/new", ensureAuthorized, (req, res) => {
  res.send(newProductTemplate({}));
});

router.post(
  "/admin/products/new",
  ensureAuthorized,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(newProductTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await addProduct({ title, price, image });
    res.redirect("/admin/products");
  }
);

router.get("/admin/products/:id/edit", ensureAuthorized, async (req, res) => {
  const product = await getOne(parseInt(req.params.id, 10));
  if (product) {
    res.send(editProductTemplate({ product }));
  } else {
    return res.send("product not found");
  }
});

router.post(
  "/admin/products/:id/edit",
  ensureAuthorized,
  upload.single("image"),
  [requireTitle, requirePrice],
  handleErrors(editProductTemplate, async req => {
    const product = await getOne(parseInt(req.params.id, 10));
    return { product };
  }),
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const changes = req.body;
    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }

    await editProduct({ id, changes });
    res.redirect("/admin/products");
  }
);

router.post(
  "/admin/products/:id/delete",
  ensureAuthorized,
  async (req, res) => {
    const id = parseInt(req.params.id, 10);
    await deleteProduct(id);
    res.redirect("/admin/products");
  }
);

module.exports = router;
