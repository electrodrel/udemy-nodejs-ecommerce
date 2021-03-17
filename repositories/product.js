const { loadDatabase } = require("./db");

const addProduct = async ({ title, price, image }) => {
  const id = Math.floor(Math.random() * 10000);
  const db = await loadDatabase();
  await db.collection("product").insertOne({ id, title, price, image });
  return id;
};

const editProduct = async ({ id, changes }) => {
  const db = await loadDatabase();
  const { title, price, image } = changes;
  const newValues = { $set: { title, price, image } };
  await db.collection("product").updateOne({ id }, newValues);
};

const deleteProduct = async (id) => {
  const db = await loadDatabase();
  await db.collection("product").deleteOne({ id });
  return id;
};

const listAll = async () => {
  const db = await loadDatabase();
  return await db.collection("product").find({}).toArray();
};

const getOne = async (id) => {
  const db = await loadDatabase();
  return await db.collection("product").findOne({ id });
};

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  listAll,
  getOne,
};
