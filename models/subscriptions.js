const { PubSub } = require("@google-cloud/pubsub");
const { createSubscription } = require("./pubsub");
var User = require('./user');


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
      createSubscription("created-user", "upload-service").catch(console.error);
  }

  execute() {
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
          throw new Error(e);
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
              return Error("An asset with that id could not be found.");
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

         Asset.findByIdAndDelete(id,async function (err, asset) {
          if (err){
               return Error("Internal server error");
              }
          else if(asset){
              await pubSubController.sendMessageDeleteAsset(req);
          }else{
              return Error("An asset with that id could not be found.");
          }
      });

         message.ack();
     });
  }
}

module.exports = Subscriptions;
