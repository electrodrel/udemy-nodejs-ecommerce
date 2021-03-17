const { check } = require("express-validator");
const { getUser } = require("../../repositories/user");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage("Must be between 5 and 40 characters")
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Must contain only letters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage("Must be a float number"),
  requireEmail: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await getUser(email);
      if (existingUser) {
        throw new Error("Email in use");
      }
    }),
  requirePassword: check("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters"),
  requirePasswordConfirmation: check("passwordConfirmation")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Must be between 4 and 20 characters")
    .custom(async (passwordConfirmation, { req }) => {
      if (req.body.password !== passwordConfirmation) {
        throw new Error("Passwords do not match");
      }
    }),
  requireEmailExists: check("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await getUser(email);
      if (!existingUser) {
        throw new Error("Email not found");
      }
    }),
  requireCorrectPassword: check("password")
    .trim()
    .custom(async (password, { req }) => {
      const existingUser = await getUser(req.body.email);
      if (existingUser) {
        if (password !== existingUser.password) {
          throw new Error("Invalid password");
        } else {
          req.session.userId = existingUser.id;
        }
      }
    }),
};
