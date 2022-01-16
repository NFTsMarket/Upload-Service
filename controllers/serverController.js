const { response } = require("express");
const { publishPubSubMessage } = require("../models/pubsub");
const googlePhotos = require('../googlePhotos/googlePhotosService')

async function sendMessageCreatedAsset (req,googlePhotosResponseId) {
  try {
    const data = req;

    var token = await googlePhotos.get_access_token_using_saved_refresh_token();
    var googlePhotosResponse = await googlePhotos.getAsset(token, googlePhotosResponseId);

    const asset={
      id:data._id,
      name:data.name,
      user:data.user,
      file:googlePhotosResponse.baseUrl
    }
    await publishPubSubMessage("created-asset", asset);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

async function sendMessageUpdateAsset(req) {
  try {
    const data = req;

    var token = await googlePhotos.get_access_token_using_saved_refresh_token();
    var googlePhotosResponse = await googlePhotos.getAsset(token, data.file);

    const asset={
      id:data._id,
      name:data.name,
      user:data.user,
      file:googlePhotosResponse.baseUrl
    }

    await publishPubSubMessage("updated-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

async function sendMessageDeleteAsset (req) {
  try {
    const data = req;

    await publishPubSubMessage("deleted-asset", data);

    console.log("Message sent to PubSub");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};


module.exports = { sendMessageCreatedAsset, sendMessageUpdateAsset,sendMessageDeleteAsset };
