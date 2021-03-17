const { loadDatabase } = require("./db");

const getUser = async (email) => {
  const db = await loadDatabase();
  return await db.collection("user").findOne({ email });
};

const createUser = async (email, password) => {
  const id = Math.floor(Math.random() * 10000);
  const db = await loadDatabase();
  await db.collection("user").insertOne({ id, email, password });
  return id;
};

module.exports = {
  getUser,
  createUser,
};
