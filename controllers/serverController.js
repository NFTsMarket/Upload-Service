const { response } = require("express");
const { publishPubSubMessage } = require("../models/pubsub");

async function sendMessageCreatedAsset (req) {
  try {
    const data = req.body;

    // throw error("Prueba");
    await publishPubSubMessage("created-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

async function sendMessageUpdateAsset(req) {
  try {
    const data = req.body;

    await publishPubSubMessage("updated-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

async function sendMessageDeleteAsset (req) {
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
