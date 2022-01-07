const { PubSub } = require("@google-cloud/pubsub");
const { createSubscription } = require("./pubsub");

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
  }

  execute() {
     // On Created user
     this.PubSub
     .subscription("asset-created-user")
     .on("message", (message) => {
         console.log("Receiving...");
         console.log(JSON.parse(message.data.toString()));
         // const { your_variables } = JSON.parse(message.data.toString());
         
         // Specify how to use the message

         message.ack();
     });

     // On Updated user
     this.PubSub
     .subscription("asset-updated-user")
     .on("message", (message) => {
         console.log("Receiving...");
         console.log(JSON.parse(message.data.toString()));
         // const { your_variables } = JSON.parse(message.data.toString());

         // Specify how to use the message

         message.ack();
     });

     // On Deleted user
     this.PubSub
     .subscription("asset-deleted-user")
     .on("message", (message) => {
         console.log("Receiving...");
         console.log(JSON.parse(message.data.toString()));
         // const { your_variables } = JSON.parse(message.data.toString());

         // Specify how to use the message

         message.ack();
     });
  }
}

module.exports = Subscriptions;
