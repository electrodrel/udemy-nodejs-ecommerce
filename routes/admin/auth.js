const express = require("express");
const { createUser } = require("../../repositories/user");
const singupTemplate = require("../../views/admin/auth/signup");
const singinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireCorrectPassword,
} = require("./validators");
const { handleErrors } = require("./middlewares");

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(singupTemplate({}));
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(singupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    const newUserId = await createUser(email, password);
    req.session.userId = newUserId;
    res.redirect("/admin/products");
  }
);

router.get("/signin", (req, res) => {
  res.send(singinTemplate({}));
});

router.post(
  "/signin",
  [requireEmailExists, requirePassword, requireCorrectPassword],
  handleErrors(singinTemplate),
  async (req, res) => {
    res.redirect("/admin/products");
  }
);

router.get("/signout", async (req, res) => {
  req.session = null;
  res.send("You've signed out");
});

module.exports = router;
