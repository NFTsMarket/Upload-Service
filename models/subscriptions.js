const { PubSub } = require("@google-cloud/pubsub");
const Asset = require("./asset");
const { createSubscription } = require("./pubsub");
var User = require('./user');
var pubSubController = require('../controllers/serverController');


class Subscriptions {
  constructor() {
    this.pubsub = new PubSub({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY,
        },
      });
  }

  initialize() {
      // createSubscription("updated-purchase", "upload-service").catch(console.error);
  }

  execute() {
    //====================== AUHT SERVICE =================
     // On Created user
     this.pubsub
     .subscription("upload-created-user")
     .on("message", async (message) => {
         console.log("Receiving...");
         console.log(JSON.parse(message.data.toString()));
         const user = JSON.parse(message.data.toString());
         
        try{
          await User.create(user);
        }catch(e){
          console.log(e);
        }

         message.ack();
     });

     // On Updated user
     this.pubsub
     .subscription("upload-updated-user")
     .on("message", (message) => {
         console.log("Receiving...");
         console.log(JSON.parse(message.data.toString()));
         const {id, ...body} = JSON.parse(message.data.toString());

         var filter = { _id: id };
         User.findOneAndUpdate(filter, body, function(err, doc) {
          if(!doc){
              console.log("An asset with that id could not be found.");
          }
        });
         message.ack();
     });

     // On Deleted user
     this.pubsub
     .subscription("upload-deleted-user")
     .on("message", (message) => {
         console.log("Receiving...");
         console.log(JSON.parse(message.data.toString()));
         const { id } = JSON.parse(message.data.toString());
         User.findOneAndDelete({id: id},async function (err, user) {
          if (err){
               console.log(err);
               console.log("Internal server error");
              }
          else if(user){
            Asset.find({user: id}, async function(error, assets) {
              Asset.deleteMany({user: id}, async function(err, doc) {
                if(doc.deletedCount==0){
                    console.log("An asset with that user could not be found.");
                }else{
                  for (asset in assets){
                    const deletedAsset = {"id": assets[asset]._id.toString()};
                    await pubSubController.sendMessageDeleteAsset(deletedAsset);
                  }
                }
              });
            });
          }else{
              console.log("An user with that id could not be found.");
          }
      });

         message.ack();
     });

      //====================== CATALOG SERVICE =================
    //  // On changed user
    //  this.pubsub
    //  .subscription("upload-updated-purchase")
    //  .on("message", async (message) => {
    //      console.log("Receiving...");
    //      console.log(JSON.parse(message.data.toString()));
    //      const user = JSON.parse(message.data.toString());
         
    //     try{
    //       var filter = { _id: req.params.id };
    //       Asset.findOneAndUpdate(filter, req.body, function (err, doc) {
    //         if (!doc) {
    //             console.log("An asset with that id could not be found.");
    //         }
    //     });

    //     }catch(e){
    //       console.log(e);
    //     }

    //      message.ack();
    //  });
  }
}

module.exports = Subscriptions;
