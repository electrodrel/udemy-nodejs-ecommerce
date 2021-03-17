const { loadDatabase } = require("./db");

const createCart = async (productId) => {
  const db = await loadDatabase();

  const id = Math.floor(Math.random() * 10000);
  const cart = { id, items: [{ id: productId, quantity: 1 }] };
  await db.collection("cart").insertOne(cart);
  return id;
};

const addToCart = async (id, productId) => {
  const db = await loadDatabase();

  const cart = await db.collection("cart").findOne({ id });
  const item = cart.items.find((x) => x.id === productId);
  let filter = {};
  let updates = {};
  if (item) {
    filter = { id, "items.id": productId };
    updates = { $set: { "items.$.quantity": item.quantity + 1 } };
  } else {
    filter = { id };
    updates = { $push: { items: { id: productId, quantity: 1 } } };
  }

  await db.collection("cart").updateOne(filter, updates);
  return id;
};

const deleteItem = async (id, productId) => {
  const db = await loadDatabase();

  db.collection("cart").updateOne(
    { id },
    { $pull: { items: { id: productId } } }
  );
};

const getCart = async (id) => {
  const db = await loadDatabase();

  return await db.collection("cart").findOne({ id });
};

module.exports = { addToCart, createCart, getCart, deleteItem };
