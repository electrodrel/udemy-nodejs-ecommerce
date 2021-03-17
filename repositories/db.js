const { MongoClient } = require("mongodb");

let client;
const loadDatabase = async () => {
  if (!client) {
    client = await MongoClient.connect('mongodb://mongodb');
  }
  return client.db('ecomm');  
};

const disconnect = () => {
  if (client) {
    client.close();
  }
};

module.exports = {
  loadDatabase,
  disconnect
};