const { response } = require("express");
const { publishPubSubMessage } = require("../models/pubsub");

const sendMessageCreatedAsset = async (req, res = response) => {
  try {
    const data = req.body;

    throw error("Prueba");
    await publishPubSubMessage("created-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const sendMessageUpdateAsset = async (req, res = response) => {
  try {
    const data = req.body;

    await publishPubSubMessage("updated-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

const sendMessageDeleteAsset = async (req, res = response) => {
  try {
    const data = req.body;

    await publishPubSubMessage("deleted-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};


module.exports = { sendMessageCreatedAsset, sendMessageUpdateAsset,sendMessageDeleteAsset };
