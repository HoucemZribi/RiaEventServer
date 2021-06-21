const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");
const cors = require("cors");
const { SendEmail } = require("./Mailer");

const express = require("express");

const app = express();

app.options("*", cors());

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/send-email", (req, res) => {
  SendEmail(req.body);
  res.send("ok").status(200);
});
//
const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});
server.applyMiddleware({ app });
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return app.listen(80);
  })
  .then((res) => {
    console.log(`Server running at ${PORT}`);
  })
  .catch((err) => {
    console.error(err);
  });
